import { useOnlineUsers } from "@/context/OnlineUsersContext";
import { FC, memo } from "react";
import { ConversationHeaderUserInfoProps } from "./ConversationHeaderUserInfo.types";

const ConversationHeaderUserInfo: FC<ConversationHeaderUserInfoProps> = ({
  username,
  additionalInfo,
}) => {
  const { onlineUsers } = useOnlineUsers();

  const renderStatusMessage = (
    info: number | string[] | undefined
  ): string | null => {
    if (typeof info === "number") {
      return onlineUsers.includes(info) ? "Available" : "Away";
    }
    if (Array.isArray(info)) {
      return info.join(", ");
    }
    return null;
  };
  renderStatusMessage(additionalInfo);
  return (
    <div className="flex flex-col justify-center">
      <div className="text-sm text-gold-600 w-32 md:w-52 truncate">
        {username}
      </div>
      {renderStatusMessage(additionalInfo) && (
        <div className="text-sm capitalize text-slate-200 w-32 md:w-52 truncate">
          {renderStatusMessage(additionalInfo)}
        </div>
      )}
    </div>
  );
};

export default memo(ConversationHeaderUserInfo);
