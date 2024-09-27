"use client";
import CallWindow from "@/app/components/callControlWindow/CallWindow";
import { useSocket } from "@/context/SocketContext";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SimplePeer, { SignalData } from "simple-peer";
import { toast } from "sonner";

export interface ICallInfo {
  status?:
    | "calling"
    | "incoming"
    | "accepted"
    | "connected"
    | "rejected"
    | "ended"
    | "recall";
  signal?: SignalData;
  peerId?: number;
  chatSessionId?: number;
  title?: string;
  image?: string | string[];
  rejectedBy?: string;
  endedBy?: string;
}

interface AudioCallContextType {
  startCall: (combinedData?: ConversationCombinedType) => void;
}

const AudioCallContext = createContext<AudioCallContextType | undefined>(
  undefined
);

export const AudioCallProvider = ({
  children,
  currentUserId,
}: {
  children: ReactNode;
  currentUserId: number;
}) => {
  const { socket } = useSocket();
  const [modal, setModal] = useState(false);
  const peersRef = useRef<Map<number, SimplePeer.Instance>>(new Map());
  const userAudioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());
  const callDurationRef = useRef<NodeJS.Timeout | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callInfo, setCallInfo] = useState<ICallInfo | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const localStreamRef = useRef<MediaStream | null>(null);

  const startCall = async (combinedData?: ConversationCombinedType) => {
    setCallInfo({
      chatSessionId: combinedData?.conversationId as number,
      image: combinedData?.image,
      title: combinedData?.title,
      status: "calling",
    });
    setModal(true);
    socket?.emit("join_media_room", `${combinedData?.conversationId}`);
    socket?.emit("audio_call_notification", {
      action: "start_call",
      chatSessionId: combinedData?.conversationId,
    });
  };

  const onAccept = () => {
    socket?.emit("join_media_room", `${callInfo?.chatSessionId}`);
  };

  const startCallTimer = () => {
    if (!callDurationRef.current) {
      callDurationRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    const handleStream = (data: ICallInfo) => {
      switch (data.status) {
        case "incoming":
          setCallInfo(data);
          setModal(true);
          break;
        case "calling":
          setCallInfo((prev) => ({
            ...prev,
            status: data.status,
          }));
          break;
        case "rejected":
          if (data.rejectedBy) {
            toast.info(`${data.rejectedBy} has rejected the call!`);
          } else {
            socket?.emit("leave_media_room", `${data?.chatSessionId}`);
            setCallInfo((prev) => ({
              ...prev,
              status: data.status,
            }));
            cleanupResources(
              peersRef,
              userAudioRefs,
              callDurationRef,
              localStreamRef,
              false
            );
          }
          break;
        case "ended":
          if (data.endedBy) {
            toast.info(`${data.endedBy} has left the call!`);
          } else {
            console.log("here")
            socket?.emit("leave_media_room", `${data?.chatSessionId}`);
            cleanupResources(
              peersRef,
              userAudioRefs,
              callDurationRef,
              localStreamRef
            );
          }
          break;
      }
    };
    socket?.on("call_started", handleStream);
    socket?.on("call_rejected", handleStream);
    socket?.on("call_ended", handleStream);
    return () => {
      socket?.off("call_started", handleStream);
      socket?.off("call_rejected", handleStream);
      socket?.off("call_ended", handleStream);
      cleanupResources(
        peersRef,
        userAudioRefs,
        callDurationRef,
        localStreamRef
      );
    };
  }, [socket]);

  const cleanupResources = (
    peersRef: React.MutableRefObject<Map<number, SimplePeer.Instance>>,
    userAudioRefs: React.MutableRefObject<Map<number, HTMLAudioElement>>,
    callDurationRef: React.MutableRefObject<NodeJS.Timeout | null>,
    localStreamRef: React.MutableRefObject<MediaStream | null>,
    closeModalAndResetCallInfo: boolean = true
  ) => {
    // Close all peer connections
    peersRef.current.forEach((peer) => {
      if (peer && !peer.destroyed) peer.destroy();
    });

    // Stop all audio streams
    userAudioRefs.current.forEach((audio) => {
      if (audio.srcObject) {
        (audio.srcObject as MediaStream).getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
      audio.pause();
      audio.srcObject = null;
    });

    // Stop the local microphone stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Clear the call duration timer
    if (callDurationRef.current) {
      clearInterval(callDurationRef.current);
      callDurationRef.current = null;
      setCallDuration(0);
    }

    // Reset the refs
    peersRef.current.clear();
    userAudioRefs.current.clear();
    setIsMuted(false);
    if (closeModalAndResetCallInfo) {
      setModal(false);
      setCallInfo(null);
    }
  };

  const onReject = () => {
    socket?.emit("leave_media_room", `${callInfo?.chatSessionId}`);
    socket?.emit("audio_call_notification", {
      action: "reject_call",
      chatSessionId: callInfo?.chatSessionId,
    });
    cleanupResources(peersRef, userAudioRefs, callDurationRef, localStreamRef);
  };

  const onEnd = () => {
    socket?.emit("leave_media_room", `${callInfo?.chatSessionId}`);
    socket?.emit("audio_call_notification", {
      action: "end_call",
      chatSessionId: callInfo?.chatSessionId,
    });
    cleanupResources(peersRef, userAudioRefs, callDurationRef, localStreamRef);
  };

  const onDismiss = () => {
    socket?.emit("leave_media_room", `${callInfo?.chatSessionId}`);
    cleanupResources(peersRef, userAudioRefs, callDurationRef, localStreamRef);
  };

  const onRecall = () => {
    setCallInfo((prev) => ({ ...prev, status: "recall" }));
    setModal(true);
    socket?.emit("join_media_room", `${callInfo?.chatSessionId}`);
    socket?.emit("audio_call_notification", {
      action: "start_call",
      chatSessionId: callInfo?.chatSessionId,
    });
  };
  const onMuteToggle = () => {
    setIsMuted((prev) => !prev);
    peersRef.current.forEach((peer) => {
      const audioTracks = peer.streams[0].getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted;
      });
    });
  };

  console.log(callInfo);
  return (
    <AudioCallContext.Provider
      value={{
        startCall,
      }}
    >
      {children}
      {modal && (
        <CallWindow
          socket={socket}
          currentUserId={currentUserId}
          peersRef={peersRef}
          userAudioRefs={userAudioRefs}
          callDuration={callDuration}
          isMuted={isMuted}
          callInfo={callInfo}
          localStreamRef={localStreamRef}
          setCallInfo={setCallInfo}
          startCallTimer={startCallTimer}
          onAccept={onAccept}
          onReject={onReject}
          onEnd={onEnd}
          onDismiss={onDismiss}
          onRecall={onRecall}
          onMuteToggle={onMuteToggle}
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
