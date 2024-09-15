import { formatDuration } from "@/utils/helpers/dateHelpers";
import { FC, memo } from "react";
import { BsMic, BsMicMuteFill } from "react-icons/bs";
import { FiMinimize2 } from "react-icons/fi";
import { HiMiniUserPlus } from "react-icons/hi2";
import { IoVideocam } from "react-icons/io5";
import {
  MdCall,
  MdCallEnd,
  MdMessage,
  MdMobileScreenShare,
} from "react-icons/md"; // Import MdMessage for chat icon
import Avatar from "../avatar/Avatar";
import { IncomingCallWindowProps } from "./IncomingCallWindow.types";

const IncomingCallWindow: FC<IncomingCallWindowProps> = ({
  incomingCallData,
  onAccept,
  onReject,
  callDuration,
  onEnd,
  isMuted,
  onMuteToggle,
}) => {
  const isAccepted = incomingCallData?.status === "accepted"; // Check if the call is accepted

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Top Buttons */}
      <div className="m-4 flex items-center justify-between text-white text-lg font-semibold">
        <div
          role="button"
          className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
        >
          <FiMinimize2 />
        </div>

        {/* Only show HiMiniUserPlus button if the call is accepted */}
        {isAccepted && (
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
          fileName={incomingCallData?.image as string}
        />
        <div className="text-center capitalize">
          <p className="text-2xl font-semibold text-white">
            {incomingCallData?.title || "Unknown Caller"}
          </p>
          <p className="text-lg text-gray-400 mt-2">
            {isAccepted
              ? callDuration > 0
                ? formatDuration(callDuration)
                : incomingCallData?.status
              : "Incoming Call..."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {isAccepted ? (
        <div className="m-4">
          {/* Control Buttons for Accepted Call */}
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
      ) : (
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
      )}
    </div>
  );
};

export default memo(IncomingCallWindow);
