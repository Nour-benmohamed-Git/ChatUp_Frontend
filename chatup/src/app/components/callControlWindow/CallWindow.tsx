import { addPeer, createPeer } from "@/utils/helpers/webRTChelpers";
import { FC, memo, useEffect } from "react";
import { BsMic, BsMicMuteFill } from "react-icons/bs";
import { FiMinimize2 } from "react-icons/fi";
import { HiOutlineSignal, HiOutlineSignalSlash } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import {
  IoCameraReverseSharp,
  IoVideocam,
  IoVideocamOff,
} from "react-icons/io5";
import {
  MdCall,
  MdCallEnd,
  MdMessage,
  MdMobileScreenShare,
  MdOutlineMobileOff,
} from "react-icons/md";
import SimplePeer from "simple-peer";
import { toast } from "sonner";
import Avatar from "../avatar/Avatar";
import CallInformation from "../callInformation/CallInformation";
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
}) => {
  useEffect(() => {
    const initMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
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
            if (!peersRef.current.has(userId) && userId != currentUserId) {
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
            peersRef.current.set(callerId, peer as SimplePeer.Instance);
          }
        };

        const handleSignalReturned = ({ status, id, signal }: any) => {
          setCallInfo((prev) => ({ ...prev, status }));
          const peer = peersRef.current.get(id);
          if (peer && !peer.destroyed) {
            peer.signal(signal);
          }
        };

        const handlePeerData = ({ peerId, videoEnabled }: any) => {
          console.log(peerId, videoEnabled);
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
            // Return the updated call info
            return { ...prev, members: updatedMembers };
          });
        };
        socket?.on("media_room_members", handleMediaRoomMembers);
        socket?.on("signal_sent", handleSignalSent);
        socket?.on("signal_returned", handleSignalReturned);
        socket?.on("video_toggled", handlePeerData);
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
      <div className="m-4 flex items-center justify-between text-white text-lg font-semibold">
        <div
          role="button"
          className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
        >
          <FiMinimize2 />
        </div>
        <CallInformation title={callInfo?.title} status={callInfo?.status} />

        <div
          role="button"
          onClick={switchCamera}
          className={`flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300  ${
            mediaSettings.isVideoEnabled &&
            callInfo?.status &&
            ["accepted", "connected", "calling"].includes(callInfo?.status)
              ? "visible"
              : "invisible"
          }`}
        >
          <IoCameraReverseSharp />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 h-full md:h-[calc(100%-12rem)] w-full px-4 md:px-8 lg:px-16">
        {callInfo?.status &&
        ["accepted", "connected", "calling"].includes(callInfo?.status) ? (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="flex flex-col md:flex-row items-center justify-center h-full w-full  gap-6 md:gap-8 lg:gap-10">
              {Array.from(userStreams.entries()).map(
                ([userId, videoElement], index) => {
                  if (index < 2) {
                    return (
                      <div
                        key={userId}
                        className="relative h-full w-full md:w-1/2 rounded-2xl overflow-hidden bg-gray-900 transition-transform transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)] shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                      >
                        {(currentUserId === userId &&
                          mediaSettings.isVideoEnabled) ||
                        callInfo?.members?.find(
                          (member) => member.id === userId
                        )?.videoEnabled ? (
                          <video
                            ref={(el) => {
                              if (el) {
                                el.srcObject = videoElement;
                                el.autoplay = true;
                              }
                            }}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                          />
                        ) : (
                          <Avatar
                            additionalClasses="h-full w-full"
                            rounded="rounded-2xl shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
                            fileName={
                              callInfo?.members?.find(
                                (member) => member.id === userId
                              )?.profilePicture
                            }
                          />
                        )}
                        <div className="absolute bottom-2 left-2 bg-gradient-to-tr from-gray-800 to-gray-600 text-white font-semibold px-2 py-1 rounded-md capitalize">
                          {callInfo?.members?.find(
                            (member) => member.id === userId
                          )?.id === currentUserId
                            ? "You"
                            : callInfo?.members?.find(
                                (member) => member.id === userId
                              )?.username}
                        </div>
                      </div>
                    );
                  } else {
                    return null; // The remaining videos will be rendered below
                  }
                }
              )}
            </div>
            {Array.from(userStreams.entries()).length > 2 ? (
              <div className="flex flex-wrap justify-center w-full mt-6 gap-4">
                {Array.from(userStreams.entries()).map(
                  ([userId, videoElement], index) => {
                    // Show remaining videos (after the first two)
                    if (index >= 2) {
                      return (
                        <div
                          key={userId}
                          className="h-40 w-40 rounded-xl overflow-hidden shadow-lg bg-gray-800 transition-transform transform hover:scale-105 hover:shadow-lg"
                        >
                          {callInfo?.members?.find(
                            (member) => member.id === userId
                          )?.videoEnabled ? (
                            <video
                              ref={(el) => {
                                if (el) {
                                  el.srcObject = videoElement;
                                  el.autoplay = true;
                                }
                              }}
                              className="w-full h-full object-cover"
                              autoPlay
                              playsInline
                            />
                          ) : (
                            <Avatar
                              additionalClasses="h-full w-full"
                              rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
                              fileName={
                                callInfo?.members?.find(
                                  (member) => member.id === userId
                                )?.profilePicture
                              }
                            />
                          )}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  }
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <Avatar
            additionalClasses="h-40 w-40"
            rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
            fileName={callInfo?.image as string}
          />
        )}
      </div>

      {callInfo?.status === "rejected" || callInfo?.status === "recall" ? (
        <div className="flex flex-col items-center justify-center space-y-6 mb-12">
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center">
              <button
                className="bg-gray-700 hover:bg-gray-800 text-white p-5 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:ring-4 hover:ring-gray-400"
                onClick={onDismiss}
              >
                <IoMdClose size={28} />
              </button>
              <p className="text-white mt-2 text-sm">Dismiss</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                disabled={callInfo?.status === "recall"}
                className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:ring-4 hover:ring-green-300 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed disabled:shadow-none"
                onClick={onRecall}
              >
                <MdCall size={28} />
              </button>
              <p className="text-white mt-2 text-sm">Retry Call</p>
            </div>
          </div>
        </div>
      ) : callInfo?.status === "incoming" ? (
        <div className="flex justify-center space-x-8 mb-12">
          <button
            onClick={onReject}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:ring-4 hover:ring-red-300"
          >
            <MdCallEnd size={28} />
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-800 text-white p-5 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:ring-4 hover:ring-gray-400"
            onClick={() => alert("Send Message")} // Action for messaging
          >
            <MdMessage size={20} />
          </button>
          <button
            onClick={onAccept}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:ring-4 hover:ring-green-300"
          >
            <MdCall size={28} />
          </button>
        </div>
      ) : (
        <div className="m-4">
          <div className="bg-gray-800 p-4 rounded-md shadow-xl flex items-center justify-around md:justify-center text-white text-xl space-x-4">
            <button
              role="button"
              disabled={
                callInfo?.status &&
                ["calling", "recall"].includes(callInfo?.status)
              }
              onClick={toggleScreenShare}
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              {mediaSettings.isSharingScreen ? (
                <MdOutlineMobileOff />
              ) : (
                <MdMobileScreenShare />
              )}
            </button>
            <div
              role="button"
              onClick={toggleNoiseReduction}
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              {mediaSettings.isNoiseReductionEnabled ? (
                <HiOutlineSignalSlash />
              ) : (
                <HiOutlineSignal />
              )}
            </div>

            <div
              role="button"
              onClick={onVideoToggle}
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              {mediaSettings.isVideoEnabled ? (
                <IoVideocam />
              ) : (
                <IoVideocamOff />
              )}
            </div>
            <div
              role="button"
              onClick={onMuteToggle}
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              {mediaSettings.isMuted ? (
                <BsMicMuteFill size={24} />
              ) : (
                <BsMic size={24} />
              )}
            </div>
            <div
              role="button"
              className="flex items-center bg-red-600 p-3 rounded-full hover:bg-red-500 transition-colors duration-300"
              onClick={onEnd}
            >
              <MdCallEnd />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(CallWindow);
