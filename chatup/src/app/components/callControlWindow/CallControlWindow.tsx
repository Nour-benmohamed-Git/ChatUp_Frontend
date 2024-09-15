import { formatDuration } from "@/utils/helpers/dateHelpers";
import { FC, memo } from "react";
import { BsMic, BsMicMuteFill } from "react-icons/bs";
import { FiMinimize2 } from "react-icons/fi";
import { HiMiniUserPlus } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { MdCall, MdCallEnd, MdMobileScreenShare } from "react-icons/md";
import Avatar from "../avatar/Avatar";
import { CallControlWindowProps } from "./CallControlWindow.types";

const CallControlWindow: FC<CallControlWindowProps> = ({
  combinedData,
  handleRecall,
  handleDismiss,
  onEnd,
  callDuration,
  status,
  isMuted,
  onMuteToggle,
}) => {
  console.log("status", status);
  const isAccepted = status === "accepted";
  const isRejected = status === "rejected";
  const isRecalling = status === "recall";

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {!isRejected ? (
        <div className="m-4 flex items-center justify-between text-white text-lg font-semibold">
          <div
            role="button"
            className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
          >
            <FiMinimize2 />
          </div>
          <div
            role="button"
            className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
          >
            <HiMiniUserPlus />
          </div>
        </div>
      ) : null}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        <Avatar
          additionalClasses="h-40 w-40 mb-6"
          rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
          fileName={combinedData?.image as string}
        />
        <div className="text-center capitalize">
          <p className="text-2xl font-semibold text-white">
            {combinedData?.title || "Unknown Caller"}
          </p>
          <p className="text-lg text-gray-400 mt-2">
            {isAccepted
              ? callDuration > 0
                ? formatDuration(callDuration)
                : "Call Accepted"
              : isRejected
              ? "Call Rejected"
              : "Calling..."}
          </p>
        </div>
      </div>

      {/* Action Buttons for Rejected Call */}
      {isRejected || isRecalling ? (
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
                disabled={isRecalling}
                className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:ring-4 hover:ring-green-300 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed disabled:shadow-none"
                onClick={handleRecall}
              >
                <MdCall size={28} />
              </button>
              <p className="text-white mt-2 text-sm">Retry Call</p>
            </div>
          </div>
        </div>
      ) : (
        // Action Buttons for Ongoing Call
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
  );
};

export default memo(CallControlWindow);
