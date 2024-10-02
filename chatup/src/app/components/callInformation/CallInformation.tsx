import { FC, memo, useEffect, useRef, useState } from "react";
import { formatDuration } from "@/utils/helpers/dateHelpers";
import { CallInformationProps } from "./CallInformation.types";

const CallInformation: FC<CallInformationProps> = ({ title, status }) => {
  const callDurationRef = useRef<NodeJS.Timeout | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const startCallTimer = () => {
      if (!callDurationRef.current) {
        callDurationRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      }
    };
    if (status && ["accepted", "connected"].includes(status)) {
      startCallTimer();
    }
    return () => {
      if (callDurationRef.current) {
        clearInterval(callDurationRef.current);
        callDurationRef.current = null;
        setCallDuration(0);
      }
    };
  }, [status]);

  const getStatusText = () => {
    if (status === "accepted") {
      return callDuration > 0 ? formatDuration(callDuration) : "Call Accepted";
    }
    if (status === "connected") {
      return callDuration > 0 ? formatDuration(callDuration) : "Connected";
    }
    if (status === "rejected") return "Call Rejected";
    if (status === "incoming") return "Incoming Call...";
    return "Calling...";
  };

  return (
    <div className="text-sm text-center capitalize">
      {status && ["calling", "incoming"].includes(status) ? (
        <p className="font-semibold text-white">{title || "Unknown Caller"}</p>
      ) : null}
      <p className="text-gray-400">{getStatusText()}</p>
    </div>
  );
};

export default memo(CallInformation);
