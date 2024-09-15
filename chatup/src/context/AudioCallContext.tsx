"use client";
import CallControlWindow from "@/app/components/callControlWindow/CallControlWindow";
import IncomingCallWindow from "@/app/components/IncomingCallWindow/IncomingCallWindow";
import { useSocket } from "@/context/SocketContext";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SimplePeer, { SignalData } from "simple-peer";
import { toast } from "sonner";

export interface IncomingCallData {
  action:
    | "startAudioCall"
    | "acceptAudioCall"
    | "rejectAudioCall"
    | "endAudioCall";
  status: "calling" | "incoming" | "accepted" | "rejected" | "ended" | "recall";
  signalingData: SignalData;
  chatSessionId: number;
  title: string;
  image: string | string[];
}

interface AudioCallContextType {
  startAudioCall: () => void;
  handleAcceptCall: () => void;
  handleRejectCall: () => void;
  handleEndCall: () => void;
  setCombinedData: Dispatch<
    SetStateAction<ConversationCombinedType | undefined>
  >;
}
const AudioCallContext = createContext<AudioCallContextType | undefined>(
  undefined
);

export const AudioCallProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const [modals, setModals] = useState({
    callDialog: false,
    incomingCallDialog: false,
  });
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const userAudio = useRef<HTMLAudioElement>(null);
  const [incomingCallData, setIncomingCallData] =
    useState<IncomingCallData | null>(null);
  const [combinedData, setCombinedData] = useState<ConversationCombinedType>();
  const [negotiationCompleted, setNegotiationCompleted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callDurationRef = useRef<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Cleanup call resources
  const cleanupCall = () => {
    console.log("Cleaning up call, stopping media streams");

    // Destroy peer connection
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
    setNegotiationCompleted(false);
    // Stop all ongoing media streams (microphone input)
    if (userAudio.current && userAudio.current.srcObject) {
      const currentStream = userAudio.current.srcObject as MediaStream;
      currentStream.getTracks().forEach((track) => track.stop());
      userAudio.current.srcObject = null; // Reset audio element srcObject
    }
    // Stop all ongoing media streams (microphone input)
    if (peer && peer.streams) {
      peer.streams.forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });
    }

    // Clear any existing call duration timer
    if (callDurationRef.current) {
      clearInterval(callDurationRef.current);
      callDurationRef.current = null;
      setCallDuration(0); // Reset call duration
    }
    setIncomingCallData(null);

    // Log microphone stopped (to simulate revoking permission)
    console.log("Microphone stopped and media tracks cleared.");
  };

  useEffect(() => {
    if (!socket) return;

    const handleAudioStream = (data: IncomingCallData) => {
      switch (data.action) {
        case "startAudioCall":
          if (data.status === "incoming") {
            setIncomingCallData(data);
            setModals((prev) => ({ ...prev, incomingCallDialog: true }));
          } else if (data.status === "calling") {
            setIncomingCallData((prev: any) => ({
              ...prev,
              action: data.action,
              status: data.status,
            }));
          }
          break;

        case "acceptAudioCall":
          callDurationRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
          }, 1000);
          setIncomingCallData((prev: any) => ({
            ...prev,
            action: data.action,
            status: data.status,
          }));

          if (peer && !negotiationCompleted) {
            peer.signal(data.signalingData);
            setNegotiationCompleted(true);
          }
          break;

        case "rejectAudioCall":
          console.log("rejectAudioCall", data.status);
          setIncomingCallData((prev: any) => ({
            ...prev,
            action: data.action,
            status: data.status,
          }));
          break;
        case "endAudioCall":
          setModals({
            callDialog: false,
            incomingCallDialog: false,
          });
          cleanupCall();
          break;
        default:
          break;
      }
    };

    socket.on("audio_stream", handleAudioStream);

    return () => {
      socket.off("audio_stream", handleAudioStream);
    };
  }, [socket, peer, negotiationCompleted]);

  const startAudioCall = () => {
    setModals((prev) => ({ ...prev, callDialog: true }));

    // Stop any existing streams before starting a new one
    if (userAudio.current && userAudio.current.srcObject) {
      const currentStream = userAudio.current.srcObject as MediaStream;
      currentStream.getTracks().forEach((track) => track.stop());
      userAudio.current.srcObject = null;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audioStream) => {
        const newPeer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream: audioStream,
        });

        newPeer.on("signal", (signal) => {
          socket?.emit("audio_call_notification", {
            action: "startAudioCall",
            signalingData: signal,
            chatSessionId: combinedData?.conversationId,
          });
        });

        newPeer.on("stream", (incomingStream) => {
          if (userAudio.current) {
            userAudio.current.srcObject = incomingStream;
            userAudio.current.play().catch((error) => {
              toast.error("Error streaming audio: " + error.message);
            });
          }
        });

        newPeer.on("close", cleanupCall);
        setPeer(newPeer);
      })
      .catch((error) => {
        toast.error("Error accessing audio stream: " + error.message);
      });
  };

  const handleIncomingCall = (data: IncomingCallData) => {
    // Stop any existing streams before starting a new one
    if (userAudio.current && userAudio.current.srcObject) {
      const currentStream = userAudio.current.srcObject as MediaStream;
      currentStream.getTracks().forEach((track) => track.stop());
      userAudio.current.srcObject = null;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((audioStream) => {
        const newPeer = new SimplePeer({
          initiator: false,
          trickle: false,
          stream: audioStream,
        });

        newPeer.on("signal", (signal) => {
          socket?.emit("audio_call_notification", {
            action: "acceptAudioCall",
            signalingData: signal,
            chatSessionId: data.chatSessionId,
          });
        });

        if (!negotiationCompleted) {
          newPeer.signal(data.signalingData);
          setNegotiationCompleted(true);
        }

        newPeer.on("stream", (incomingStream) => {
          if (userAudio.current) {
            userAudio.current.srcObject = incomingStream;
            userAudio.current.play().catch((error) => {
              toast.error("Error streaming audio: " + error.message);
            });
          }
        });

        newPeer.on("close", cleanupCall);

        setPeer(newPeer);
      })
      .catch((error) => {
        toast.error("Error accessing audio stream: " + error.message);
      });
  };

  const handleAcceptCall = () => {
    if (incomingCallData) handleIncomingCall(incomingCallData);
  };

  const handleRejectCall = () => {
    if (incomingCallData) {
      console.log("handleRejectCall");
      socket?.emit("audio_call_notification", {
        action: "rejectAudioCall",
        chatSessionId: incomingCallData.chatSessionId,
      });
      setModals((prev) => ({ ...prev, incomingCallDialog: false }));
    }
  };

  const handleEndCall = () => {
    if (socket && peer) {
      socket.emit("audio_call_notification", {
        action: "endAudioCall",
        chatSessionId: combinedData?.conversationId,
      });
    }
  };
  const toggleMute = () => {
    if (peer) {
      peer.streams.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.enabled = isMuted;
        });
      });
    }
    setIsMuted((prev) => !prev);
  };

  const handleDismiss = () => {
    setModals((prev) => ({ ...prev, callDialog: false }));
    cleanupCall();
  };
  const handleRecall = () => {
    setIncomingCallData((prev: any) => ({
      ...prev,
      status: "recall",
    }));
    startAudioCall();
  };
  return (
    <AudioCallContext.Provider
      value={{
        startAudioCall,
        handleAcceptCall,
        handleRejectCall,
        handleEndCall,
        setCombinedData,
      }}
    >
      {children}
      <audio ref={userAudio} autoPlay controls />
      {modals.callDialog && (
        <CallControlWindow
          status={incomingCallData?.status}
          combinedData={combinedData}
          handleRecall={handleRecall}
          handleDismiss={handleDismiss}
          onEnd={handleEndCall}
          callDuration={callDuration}
          isMuted={isMuted}
          onMuteToggle={toggleMute}
        />
      )}

      {modals.incomingCallDialog && (
        <IncomingCallWindow
          incomingCallData={incomingCallData}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          callDuration={callDuration}
          onEnd={handleEndCall}
          isMuted={isMuted}
          onMuteToggle={toggleMute}
        />
      )}
    </AudioCallContext.Provider>
  );
};

export const useAudioCall = () => {
  const context = useContext(AudioCallContext);
  if (context === undefined) {
    throw new Error("useAudioCall must be used within an AudioCallProvider");
  }
  return context;
};
