import { FC, memo } from "react";
import { FiMinimize2 } from "react-icons/fi";
import { IoCameraReverseSharp } from "react-icons/io5";
import CallInformation from "../callInformation/CallInformation";
import { CallHeaderProps } from "./CallHeader.types";

const CallHeader: FC<CallHeaderProps> = ({
  callInfo,
  switchCamera,
  mediaSettings,
}) => {
  return (
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
        className={`flex items-center bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors duration-300 ${
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
  );
};

export default memo(CallHeader);
