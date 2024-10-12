import { FC, memo } from "react";
import { BsMic, BsMicMuteFill } from "react-icons/bs";
import { HiOutlineSignal, HiOutlineSignalSlash } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import {
  MdCall,
  MdCallEnd,
  MdMessage,
  MdMobileScreenShare,
  MdOutlineMobileOff,
} from "react-icons/md";
import { CallActionButtonsProps } from "./CallActionButtons.types";

const CallActionButtons: FC<CallActionButtonsProps> = ({
  callInfo,
  mediaSettings,
  onAccept,
  onDismiss,
  onRecall,
  onReject,
  onMuteToggle,
  onVideoToggle,
  toggleNoiseReduction,
  toggleScreenShare,
  onEnd,
}) => {
  return (
    <>
      {callInfo?.status && ["rejected", "recall"].includes(callInfo?.status) ? (
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
              onClick={toggleScreenShare}
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              {mediaSettings.isSharingScreen ? (
                <MdOutlineMobileOff />
              ) : (
                <MdMobileScreenShare />
              )}
            </button>
            <button
              role="button"
              onClick={toggleNoiseReduction}
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              {mediaSettings.isNoiseReductionEnabled ? (
                <HiOutlineSignalSlash />
              ) : (
                <HiOutlineSignal />
              )}
            </button>
            <button
              role="button"
              onClick={onVideoToggle}
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              {mediaSettings.isVideoEnabled ? (
                <IoVideocam />
              ) : (
                <IoVideocamOff />
              )}
            </button>
            <button
              role="button"
              onClick={onMuteToggle}
              className="flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              {mediaSettings.isMuted ? (
                <BsMicMuteFill size={24} />
              ) : (
                <BsMic size={24} />
              )}
            </button>
            <button
              role="button"
              onClick={onEnd}
              className="flex items-center bg-red-600 p-3 rounded-full hover:bg-red-500 transition-colors duration-300"
            >
              <MdCallEnd />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CallActionButtons);
