import { formatDuration } from "@/utils/helpers/dateHelpers";
import { FC, memo, useEffect, useRef, useState } from "react";
import { BsMic, BsMicMuteFill } from "react-icons/bs";
import { FiMinimize2 } from "react-icons/fi";
import { HiMiniUserPlus } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import {
  MdCall,
  MdCallEnd,
  MdMessage,
  MdMobileScreenShare,
} from "react-icons/md"; // Import MdMessage for chat icon
import SimplePeer, { SignalData } from "simple-peer";
import { toast } from "sonner";
import Avatar from "../avatar/Avatar";
import { CallWindowProps } from "./CallWindow.types";

const CallWindow: FC<CallWindowProps> = ({
  socket,
  callInfo,
  setCallInfo,
  onAccept,
  handleRecall,
  handleDismiss,
  onReject,
  onEnd,
  isMuted,
  onMuteToggle,
}) => {
  const peersRef = useRef<Map<number, SimplePeer.Instance>>(new Map());
  const userAudioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());
  const callDurationRef = useRef<NodeJS.Timeout | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const startCallTimer = () => {
    if (!callDurationRef.current) {
      callDurationRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  async function createPeer(peerId: number, stream: MediaStream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:127.0.0.1:3478",
            username: "root",
            credential: "root",
          },
        ],
      },
    });
    if (!peer.destroyed) {
      peer.on("signal", (signal) => {
        console.log("Sending signal back to peer:", peerId, signal);
        socket?.emit("audio_call_notification", {
          action: "send_signal",
          peerId,
          signal,
        });
      });
    }
    peer.on("stream", async (incomingStream) => {
      const audioElement = new Audio();
      userAudioRefs.current.set(peerId, audioElement);
      audioElement.srcObject = incomingStream;
      try {
        await audioElement.play();
      } catch (error) {
        toast.error("Error streaming audio: " + error);
      }
    });

    peer.on("connect", () => {
      console.log("Peer connection established with:", peerId);
    });

    peer.on("error", (err) => {
      console.error("createPeer===>Peer connection error:", err);
      peersRef.current.delete(peerId);
      peer.destroy();
    });

    peer.on("close", () => {
      console.log("createPeer===>Peer connection closed.");
      peersRef.current.delete(peerId);

      peer.destroy();
    });
    return peer;
  }

  async function addPeer(
    incomingSignal: SignalData,
    callerId: number,
    stream: MediaStream
  ) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:127.0.0.1:3478",
            username: "root",
            credential: "root",
          },
        ],
      },
    });

    if (!peer.destroyed) {
      peer.on("signal", (signal) => {
        console.log("Sending signal back to peer:", callerId, signal);
        socket?.emit("audio_call_notification", {
          action: "return_signal",
          signal,
          callerId,
        });
      });
    }

    peer.on("stream", async (incomingStream) => {
      const audioElement = new Audio();
      userAudioRefs.current.set(callerId, audioElement);
      audioElement.srcObject = incomingStream;
      try {
        await audioElement.play();
      } catch (error) {
        toast.error("Error streaming audio: " + error);
      }
    });
    peer.on("connect", () => {
      console.log("Peer connection established with:", callerId);
    });

    peer.on("error", (err) => {
      console.error("addPeer===>Peer connection error:", err);
      peersRef.current.delete(callerId);
      peer.destroy();
    });

    peer.on("close", () => {
      console.log("addPeer===>Peer connection closed.");
      peersRef.current.delete(callerId);
      peer.destroy();
    });
   
    peer.signal(incomingSignal);
    return peer;
  }

  useEffect(() => {
    const initMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const handleMediaRoomMembers = (users: number[]) => {
          console.log("users", users);
          for (const userId of users) {
            if (!peersRef.current.has(userId)) {
              createPeer(userId, stream).then((peer) => {
                peersRef.current.set(userId, peer);
              });
            }
          }
        };

        const handleSignalSent = async ({ status, callerId, signal }: any) => {
          setCallInfo((prev) => ({ ...prev, status }));
          startCallTimer();
          if (!peersRef.current.has(callerId)) {
            const peer = await addPeer(signal, callerId, stream);
            peersRef.current.set(callerId, peer as SimplePeer.Instance);
          }
        };

        const handleSignalReturned = ({ status, id, signal }: any) => {
          setCallInfo((prev) => ({ ...prev, status }));
          startCallTimer();
          const peer = peersRef.current.get(id);
          if (peer && !peer.destroyed) {
            peer.signal(signal);
          }
        };

        socket?.on("media_room_members", handleMediaRoomMembers);
        socket?.on("signal_sent", handleSignalSent);
        socket?.on("signal_returned", handleSignalReturned);
      } catch (error) {
        console.error("Error accessing media devices.", error);
        toast.error("Could not access microphone: " + error);
      }
    };

    initMediaStream();

    return () => {
      socket?.off("media_room_members");
      socket?.off("signal_sent");
      socket?.off("signal_returned");
    };
  }, [socket]);
  return (
    <>
      {Array.from(userAudioRefs.current.entries()).map(
        ([userId, audioElement]) => (
          <audio
            key={userId}
            ref={(el) => {
              if (el) {
                el.srcObject = audioElement.srcObject; // Set srcObject for the audio element
                el.autoplay = true; // Ensure autoplay
                // el.controls = false; // Disable controls
              }
            }}
            autoPlay
          />
        )
      )}

      <div className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        {/* Top Buttons */}
        <div className="m-4 flex items-center justify-between text-white text-lg font-semibold">
          <div
            role="button"
            className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
          >
            <FiMinimize2 />
          </div>

          {/* Show the add user button only if the call is accepted */}
          {callInfo?.status === "accepted" && (
            <div
              role="button"
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              <HiMiniUserPlus />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-1">
          <Avatar
            additionalClasses="h-40 w-40 mb-6"
            rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
            fileName={callInfo?.image as string}
          />
          <div className="text-center capitalize">
            <p className="text-2xl font-semibold text-white">
              {callInfo?.title || "Unknown Caller"}
            </p>
            <p className="text-lg text-gray-400 mt-2">
              {callInfo?.status === "accepted"
                ? callDuration > 0
                  ? formatDuration(callDuration)
                  : "Call Accepted"
                : callInfo?.status === "rejected"
                ? "Call Rejected"
                : callInfo?.status === "incoming"
                ? "Incoming Call..."
                : "Calling..."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {callInfo?.status === "rejected" || callInfo?.status === "recall" ? (
          <div className="flex flex-col items-center justify-center space-y-6 mb-12">
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center">
                <button
                  className="bg-gray-700 hover:bg-gray-800 text-white p-5 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:ring-4 hover:ring-gray-400"
                  onClick={handleDismiss}
                >
                  <IoMdClose size={28} />
                </button>
                <p className="text-white mt-2 text-sm">Dismiss</p>
              </div>
              <div className="flex flex-col items-center">
                <button
                  disabled={callInfo?.status === "recall"}
                  className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:ring-4 hover:ring-green-300 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed disabled:shadow-none"
                  onClick={handleRecall}
                >
                  <MdCall size={28} />
                </button>
                <p className="text-white mt-2 text-sm">Retry Call</p>
              </div>
            </div>
          </div>
        ) : callInfo?.status === "incoming" ? (
          <div className="flex justify-center space-x-8 mb-12">
            {/* Incoming Call Buttons */}
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
          // Control buttons for ongoing call
          <div className="m-4">
            <div className="bg-gray-800 p-4 rounded-md shadow-xl flex items-center justify-around md:justify-center text-white text-xl space-x-4">
              <div
                role="button"
                className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
              >
                <MdMobileScreenShare />
              </div>
              <div
                role="button"
                className="flex items-center bg-gold-600 p-3 rounded-full hover:bg-gold-500 transition-colors duration-300"
              >
                <IoVideocam />
              </div>
              <div
                role="button"
                onClick={onMuteToggle}
                className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
              >
                {isMuted ? <BsMicMuteFill size={24} /> : <BsMic size={24} />}
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
    </>
  );
};

export default memo(CallWindow);
