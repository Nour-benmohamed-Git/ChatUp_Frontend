import { addPeer, createPeer } from "@/utils/helpers/webRTChelpers";
import { FC, memo, useEffect } from "react";
import { toast } from "sonner";
import Avatar from "../avatar/Avatar";
import CallActionButtons from "../callActionButtons/CallActionButtons";
import CallHeader from "../callHeader/CallHeader";
import UserStream from "../userStream/UserStream";
import { CallWindowProps } from "./CallWindow.types";

const CallWindow: FC<CallWindowProps> = ({
  socket,
  currentUserId,
  peersRef,
  localStream,
  callInfo,
  setCallInfo,
  userStreams,
  setUserStreams,
  mediaSettings,
  onAccept,
  onDismiss,
  onRecall,
  onReject,
  onEnd,
  onMuteToggle,
  onVideoToggle,
  toggleNoiseReduction,
  switchCamera,
  toggleScreenShare,
  setMediaSettings,
}) => {
  useEffect(() => {
    const initMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { noiseSuppression: false, echoCancellation: true },
          video: mediaSettings.isVideoEnabled,
        });
        localStream.current = stream;
        setUserStreams((prevUserStreams) => {
          const updatedUserStreams = new Map(prevUserStreams);
          updatedUserStreams.set(currentUserId, stream);
          return updatedUserStreams;
        });

        const handleMediaRoomMembers = (users: number[]) => {
          console.log("users", users);
          for (const userId of users) {
            if (!peersRef.current.has(userId) && userId !== currentUserId) {
              createPeer(socket, peersRef, setUserStreams, userId, stream).then(
                (peer) => {
                  peersRef.current.set(userId, peer);
                }
              );
            }
          }
        };

        const handleSignalSent = async ({ status, callerId, signal }: any) => {
          setCallInfo((prev) => ({ ...prev, status }));
          if (!peersRef.current.has(callerId)) {
            const peer = await addPeer(
              socket,
              peersRef,
              setUserStreams,
              signal,
              callerId,
              stream
            );
            peersRef.current.set(callerId, peer);
          }
        };

        const handleSignalReturned = ({ status, id, signal }: any) => {
          setCallInfo((prev) => ({ ...prev, status }));
          setMediaSettings((prev) => ({
            ...prev,
            isVideoEnabled: callInfo?.members?.find(
              (user) => user.id === currentUserId
            )?.videoEnabled as boolean,
          }));
          const peer = peersRef.current.get(id);
          if (peer && !peer.destroyed) {
            peer.signal(signal);
          }
        };

        const handleVideoToggled = async ({ peerId, videoEnabled }: any) => {
          setCallInfo((prev) => {
            if (!prev?.members) {
              return prev; // Return the current state if no members are present
            }
            // Update the videoEnabled state for the correct user
            const updatedMembers = prev.members.map((member) => {
              if (member.id === peerId) {
                return { ...member, videoEnabled: videoEnabled };
              }
              return member;
            });
            return { ...prev, members: updatedMembers };
          });
        };
        socket?.on("media_room_members", handleMediaRoomMembers);
        socket?.on("signal_sent", handleSignalSent);
        socket?.on("signal_returned", handleSignalReturned);
        socket?.on("video_toggled", handleVideoToggled);
      } catch (error) {
        toast.error(error as string);
      }
    };
    initMediaStream();
    return () => {
      socket?.off("media_room_members");
      socket?.off("signal_sent");
      socket?.off("signal_returned");
      socket?.off("video_toggled");
    };
  }, [socket]);

 
  return (
    <div className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <CallHeader
        callInfo={callInfo}
        switchCamera={switchCamera}
        mediaSettings={mediaSettings}
      />
      <div className="flex flex-col items-center justify-center flex-1 h-full md:h-[calc(100%-12rem)] w-full px-4 md:px-8 lg:px-16">
        {(callInfo?.status &&
          ["accepted", "connected"].includes(callInfo?.status)) ||
        mediaSettings.isVideoEnabled ? (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="flex flex-col md:flex-row items-center justify-center h-full w-full gap-6 md:gap-8 lg:gap-10">
              {Array.from(userStreams.entries()).map(
                ([userId, mediaStream], index) => {
                  if (index < 2) {
                    const member = callInfo?.members?.find(
                      (member) => member.id === userId
                    );
                    return (
                      <UserStream
                        key={userId}
                        mediaStream={mediaStream}
                        isVideoEnabled={
                          (currentUserId === userId &&
                            mediaSettings.isVideoEnabled) ||
                          (member?.videoEnabled ?? false)
                        }
                        isCurrentUser={currentUserId === userId}
                        profilePicture={member?.profilePicture}
                        username={member?.username}
                      />
                    );
                  } else {
                    return null; // Remaining videos handled elsewhere
                  }
                }
              )}
            </div>
          </div>
        ) : (
          <Avatar
            additionalClasses="h-40 w-40"
            rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
            fileName={callInfo?.image as string}
          />
        )}
      </div>
      <CallActionButtons
        callInfo={callInfo}
        mediaSettings={mediaSettings}
        onAccept={onAccept}
        onDismiss={onDismiss}
        onRecall={onRecall}
        onReject={onReject}
        onEnd={onEnd}
        onMuteToggle={onMuteToggle}
        onVideoToggle={onVideoToggle}
        toggleNoiseReduction={toggleNoiseReduction}
        toggleScreenShare={toggleScreenShare}
      />
    </div>
  );
};

export default memo(CallWindow);
