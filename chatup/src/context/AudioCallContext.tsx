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
  const peersRef = useRef<Map<number, SimplePeer.Instance>>(new Map());
  const [callInfo, setCallInfo] = useState<ICallInfo | null>(null);
  const [userStreams, setUserStreams] = useState<
    Map<number, MediaStream | null>
  >(new Map());
  const localStream = useRef<MediaStream | null>(null);

  const [modal, setModal] = useState(false);

  const [mediaSettings, setMediaSettings] = useState({
    isMuted: false,
    isVideoEnabled: true,
    isSharingScreen: false,
    isNoiseReductionEnabled: false,
  });
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
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
    });

    // Stop the local camera/microphone stream
    if (localStream.current?.active) {
      localStream.current.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop(); // Stop any live track
        }
      });
    }

    peersRef.current.clear();
    setUserStreams(new Map());
    localStream.current = null;
    setMediaSettings({
      isMuted: false,
      isVideoEnabled: true,
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
    setMediaSettings((prev) => {
      const newMuteState = !prev.isMuted; // Determine the new mute state

      // Update the local audio track
      peersRef.current.forEach((peer) => {
        const audioTracks = peer.streams[0]?.getAudioTracks();
        audioTracks?.forEach((track) => {
          track.enabled = newMuteState; // Mute or unmute based on the new state
        });
      });

      // If local stream is available, update its audio tracks as well
      if (localStream.current) {
        localStream.current.getAudioTracks().forEach((track) => {
          track.enabled = !newMuteState; // Mute or unmute based on the new state
        });
      }

      return { ...prev, isMuted: newMuteState };
    });
  };
  const onVideoToggle = () => {
    setMediaSettings((prev) => {
      const newVideoState = !prev.isVideoEnabled;
      socket?.emit("audio_call_notification", {
        action: "video_toggle",
        chatSessionId: callInfo?.chatSessionId,
        videoEnabled: newVideoState,
      });
      if (localStream.current) {
        localStream.current.getVideoTracks().forEach((track) => {
          track.enabled = newVideoState;
        });
      }
      // Update the peers with the video state change
      peersRef.current.forEach((peer) => {
        const videoTracks = peer.streams[0]?.getVideoTracks();
        videoTracks?.forEach((track) => {
          track.enabled = newVideoState;
        });
      });
      return { ...prev, isVideoEnabled: newVideoState };
    });
  };
    // Switch camera function
    const switchCamera = async () => {
      if (localStream.current) {
        const videoTracks = localStream.current.getVideoTracks();
        const currentTrack = videoTracks[0];
  
        // Determine the facing mode of the current track
        const newCamera =
          currentTrack.getSettings().facingMode === "user"
            ? "environment"
            : "user"; // Toggle between front and back cameras
  
        try {
          // Request a new stream with the desired camera
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: newCamera },
            audio: true,
          });
  
          // Stop all tracks in the current stream before switching
          localStream.current.getTracks().forEach((track) => track.stop());
  
          // Clear the old tracks from localStream
          localStream.current.getTracks().forEach((track) => {
            localStream.current?.removeTrack(track);
          });
  
          // Add the new video track from the new stream
          newStream.getTracks().forEach((track) => {
            localStream.current?.addTrack(track);
          });
  
          // Update the userStreams state
          setUserStreams((prevUserStreams) => {
            const updatedUserStreams = new Map(prevUserStreams);
            updatedUserStreams.set(currentUserId, localStream.current);
            return updatedUserStreams;
          });
  
          // Notify peers of the new stream
          peersRef.current.forEach((peer) => {
            const newVideoTrack = newStream.getVideoTracks()[0];
            peer.replaceTrack(currentTrack, newVideoTrack, peer.streams[0]);
          });
  
          // Cleanup the new stream
          newStream.getTracks().forEach((track) => {
            track.onended = () => {
              // Stop the track on stream end to prevent resource leakage
              track.stop();
            };
          });
        } catch (error) {
          console.error("Error switching camera:", error);
          toast.error("Failed to switch camera.");
        }
      }
    };
  

  const toggleNoiseReduction = async () => {
    setMediaSettings((prev) => {
      const newNoiseReductionState = !prev.isNoiseReductionEnabled;

      // Update the local stream if it exists
      if (localStream.current) {
        const videoTracks = localStream.current.getVideoTracks();
        const audioTracks = localStream.current.getAudioTracks();

        // Stop all tracks before restarting with new constraints
        videoTracks.forEach((track) => track.stop());
        audioTracks.forEach((track) => track.stop());

        // Reinitialize the media stream with the updated noise suppression setting
        navigator.mediaDevices
          .getUserMedia({
            audio: {
              noiseSuppression: newNoiseReductionState, // Toggle noise suppression
              echoCancellation: true,
            },
            video: true,
          })
          .then((newStream) => {
            localStream.current = newStream;

            // Update user streams
            setUserStreams((prevUserStreams) => {
              const updatedUserStreams = new Map(prevUserStreams);
              updatedUserStreams.set(currentUserId, localStream.current);
              return updatedUserStreams;
            });

            // Notify peers about the updated stream
            peersRef.current.forEach((peer) => {
              peer.replaceTrack(
                peer.streams[0].getVideoTracks()[0],
                newStream.getVideoTracks()[0],
                peer.streams[0]
              );
            });
          })
          .catch((error) => {
            toast.error("Failed to toggle noise reduction.", error);
          });
      }

      // Return the updated settings object
      return { ...prev, isNoiseReductionEnabled: newNoiseReductionState };
    });
  };


  const toggleScreenShare = async () => {
    setMediaSettings((prev) => {
      const isCurrentlySharingScreen = prev.isSharingScreen;

      if (!isCurrentlySharingScreen) {
        socket?.emit("screen_share_start", { userId: currentUserId });

        // Start screen sharing
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then((screenStream) => {
            const screenTrack = screenStream.getVideoTracks()[0];

            // Replace video track in peers
            peersRef.current.forEach((peer) => {
              const oldTrack = peer.streams[0].getVideoTracks()[0];
              peer.replaceTrack(oldTrack, screenTrack, peer.streams[0]);
            });

            // Update local stream
            if (localStream.current) {
              localStream.current
                .getVideoTracks()
                .forEach((track) => track.stop());
              localStream.current.addTrack(screenTrack);
            }

            // Set a handler to detect when the screen sharing ends
            screenTrack.onended = stopScreenShare;
          })
          .catch(() => {
            toast.error("Failed to start screen sharing.");
          });
      } else {
        stopScreenShare();
      }

      return {
        ...prev,
        isSharingScreen: !isCurrentlySharingScreen,
      };
    });
  };

  const stopScreenShare = async () => {
    try {
      // Reacquire user's webcam stream
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // Assuming audio is also needed
      });

      const userVideoTrack = userStream.getVideoTracks()[0];

      // Replace the screen track with the webcam video track for peers
      peersRef.current.forEach((peer) => {
        const oldTrack = peer.streams[0].getVideoTracks()[0];
        peer.replaceTrack(oldTrack, userVideoTrack, peer.streams[0]);
      });

      // Update local stream
      if (localStream.current) {
        // Remove existing tracks and add the new webcam video track
        localStream.current.getTracks().forEach((track) => track.stop());
        localStream.current = userStream;

        // Update user streams for the local user to display their webcam video again
        setUserStreams((prevUserStreams) => {
          const updatedUserStreams = new Map(prevUserStreams);
          updatedUserStreams.set(currentUserId, localStream.current);
          return updatedUserStreams;
        });
      }
    } catch (error) {
      toast.error("Failed to stop screen sharing.");
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
