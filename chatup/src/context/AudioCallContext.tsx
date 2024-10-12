"use client";
import CallWindow from "@/app/components/callControlWindow/CallWindow";
import { useSocket } from "@/context/SocketContext";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import { replaceVideoTrackForPeers } from "@/utils/helpers/webRTChelpers";
import { error } from "console";
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
  members?: {
    id: number;
    username: string;
    profilePicture: string;
    videoEnabled?: boolean;
  }[];
  title?: string;
  image?: string | string[];
  rejectedBy?: string;
  endedBy?: string;
}
interface AudioCallContextType {
  startCall: (
    callType: "audio" | "video",
    combinedData?: ConversationCombinedType
  ) => void;
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
  const [userStreams, setUserStreams] = useState<
    Map<number, MediaStream | null>
  >(new Map());
  const localStream = useRef<MediaStream | null>(null);
  const [callInfo, setCallInfo] = useState<ICallInfo | null>(null);
  const [mediaSettings, setMediaSettings] = useState({
    isMuted: false,
    isVideoEnabled: false,
    isSharingScreen: false,
    isNoiseReductionEnabled: false,
  });

  const startCall = async (
    callType: "audio" | "video" = "audio",
    combinedData?: ConversationCombinedType
  ) => {
    const isVideoCall = callType === "video";
    setMediaSettings((prev) => ({
      ...prev,
      isVideoEnabled: isVideoCall,
    }));
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
      callType: callType,
    });
  };

  const onAccept = () => {
    socket?.emit("join_media_room", `${callInfo?.chatSessionId}`);
  };

  const toggleNoiseReduction = () => {
    setMediaSettings((prev) => {
      const newNoiseReductionState = !prev.isNoiseReductionEnabled;
      if (localStream.current) {
        const audioTrack = localStream.current.getAudioTracks()[0];
        audioTrack
          .applyConstraints({
            noiseSuppression: newNoiseReductionState,
            echoCancellation: true,
          })
          .catch((error) => {
            console.error("Error toggling noise reduction:", error);
            toast.error("Failed to toggle noise reduction.");
          });
      }

      return { ...prev, isNoiseReductionEnabled: newNoiseReductionState };
    });
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
            members: data.members,
            status: data.status,
          }));
          break;
        case "rejected":
          if (data.rejectedBy) {
            toast.info(`${data.rejectedBy} has rejected the call!`);
          } else {
            setCallInfo((prev) => ({
              ...prev,
              status: data.status,
            }));
            cleanupResources(data.chatSessionId, false);
          }
          break;
        case "ended":
          if (data.endedBy) {
            toast.info(`${data.endedBy} has left the call!`);
          } else {
            cleanupResources(data.chatSessionId);
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
    };
  }, [socket]);

  const cleanupResources = (
    conversationId?: number,
    closeModalAndResetCallInfo: boolean = true
  ) => {
    socket?.emit("leave_media_room", `${conversationId}`);
    peersRef.current.forEach((peer) => {
      if (peer && !peer.destroyed) peer.destroy();
    });

    userStreams.forEach((userStream) => {
      if (userStream) {
        userStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    });

    // Stop the local camera/microphone stream
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    peersRef.current.clear();
    setUserStreams(new Map());
    localStream.current = null;
    setMediaSettings({
      isMuted: false,
      isVideoEnabled: false,
      isSharingScreen: false,
      isNoiseReductionEnabled: false,
    });
    if (closeModalAndResetCallInfo) {
      setModal(false);
      setCallInfo(null);
    }
  };

  const onReject = () => {
    socket?.emit("audio_call_notification", {
      action: "reject_call",
      chatSessionId: callInfo?.chatSessionId,
    });
    cleanupResources(callInfo?.chatSessionId);
  };

  const onEnd = () => {
    socket?.emit("audio_call_notification", {
      action: "end_call",
      chatSessionId: callInfo?.chatSessionId,
    });
    cleanupResources(callInfo?.chatSessionId);
  };

  const onDismiss = () => {
    cleanupResources(callInfo?.chatSessionId);
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
    // Update the local stream's audio track based on the mute state
    setMediaSettings((prev) => {
      const newMuteState = !prev.isMuted; // Toggle mute state

      // Update the local stream if it exists
      if (localStream.current) {
        const audioTrack = localStream.current.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !newMuteState; // Mute or unmute the audio track
        }
      }
      return { ...prev, isMuted: newMuteState }; // Return new media settings state
    });
  };

  const onVideoToggle = async () => {
    setMediaSettings((prev) => {
      const newVideoState = !prev.isVideoEnabled;
      if (newVideoState) {
        navigator.mediaDevices
          .getUserMedia({
            audio: { noiseSuppression: false, echoCancellation: true },
            video: true,
          })
          .then((stream) => {
            peersRef.current.forEach((peer) => {
              if (localStream.current?.getVideoTracks()[0]) {
                peer.replaceTrack(
                  localStream.current.getVideoTracks()[0],
                  stream.getVideoTracks()[0],
                  localStream.current
                );
              } else {
                peer.addTrack(
                  stream.getVideoTracks()[0],
                  localStream.current as MediaStream
                );
              }
            });
            localStream.current?.addTrack(stream.getVideoTracks()[0]);
            localStream.current?.removeTrack(
              localStream.current.getVideoTracks()[0]
            );
          })
          .catch((error) => console.log(error));
      } else {
        const videoTrack = localStream.current?.getVideoTracks()[0];
        if (videoTrack) {
          peersRef.current.forEach((peer) => {
            peer.removeTrack(videoTrack, localStream.current as MediaStream);
          });
          videoTrack.stop();
        }
      }
      socket?.emit("audio_call_notification", {
        action: "video_toggle",
        chatSessionId: callInfo?.chatSessionId,
        videoEnabled: newVideoState,
      });
      return { ...prev, isVideoEnabled: newVideoState };
    });
  };

  const switchCamera = async () => {
    if (localStream.current) {
      try {
        const videoTrack = localStream.current.getVideoTracks()[0];
        const currentFacingMode = videoTrack.getSettings().facingMode;

        const newFacingMode =
          currentFacingMode === "user" ? "environment" : "user";
        await videoTrack.applyConstraints({
          facingMode: newFacingMode,
        });
        replaceVideoTrackForPeers(peersRef, videoTrack);
      } catch (error) {
        console.error("Error switching camera:", error);
        toast.error("Failed to switch camera.");
      }
    }
  };

  const toggleScreenShare = async () => {
    setMediaSettings((prev) => {
      const isCurrentlySharingScreen = !prev.isSharingScreen;

      if (!isCurrentlySharingScreen) {
        socket?.emit("screen_share_start", { userId: currentUserId });

        // Start screen sharing
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then((screenStream) => {
            const screenTrack = screenStream.getVideoTracks()[0];

            // Replace video track in local stream and notify peers
            replaceVideoTrackForPeers(peersRef, screenTrack);
            if (localStream.current) {
              localStream.current.removeTrack(
                localStream.current.getVideoTracks()[0]
              );
              localStream.current.addTrack(screenTrack);
            }

            // Handle the end of screen sharing
            screenTrack.onended = stopScreenShare;
          })
          .catch((error) => {
            console.error("Failed to start screen sharing:", error);
            toast.error("Failed to start screen sharing.");
          });
      } else {
        stopScreenShare();
      }

      return {
        ...prev,
        isSharingScreen: isCurrentlySharingScreen,
      };
    });
  };

  const stopScreenShare = async () => {
    if (localStream.current) {
      try {
        // Restore the regular camera
        const videoConstraints = { video: { facingMode: "user" }, audio: true };
        const userStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );
        const userVideoTrack = userStream.getVideoTracks()[0];
        replaceVideoTrackForPeers(peersRef, userVideoTrack);
        // Update the local stream
        localStream.current.removeTrack(
          localStream.current.getVideoTracks()[0]
        );
        localStream.current.addTrack(userVideoTrack);
      } catch (error) {
        console.error("Error stopping screen share:", error);
        toast.error("Failed to stop screen sharing.");
      }
    }
  };
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
          localStream={localStream}
          callInfo={callInfo}
          setCallInfo={setCallInfo}
          userStreams={userStreams}
          setUserStreams={setUserStreams}
          mediaSettings={mediaSettings}
          onAccept={onAccept}
          onReject={onReject}
          onEnd={onEnd}
          onDismiss={onDismiss}
          onRecall={onRecall}
          onMuteToggle={onMuteToggle}
          onVideoToggle={onVideoToggle}
          toggleNoiseReduction={toggleNoiseReduction}
          switchCamera={switchCamera}
          toggleScreenShare={toggleScreenShare}
          setMediaSettings={setMediaSettings}
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
