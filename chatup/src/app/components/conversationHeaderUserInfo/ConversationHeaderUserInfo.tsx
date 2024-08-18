import { useOnlineUsers } from "@/context/OnlineUsersContext";
import { FC, memo } from "react";
import { ConversationHeaderUserInfoProps } from "./ConversationHeaderUserInfo.types";
const ConversationHeaderUserInfo: FC<ConversationHeaderUserInfoProps> = (
  props
) => {
  const { username, userId } = props;

  const { onlineUsers } = useOnlineUsers();
  const isOnline = onlineUsers.indexOf(userId) !== -1;

  return (
    <div className="flex flex-col">
      <div className="text-sm text-gold-600 w-32  md:w-44 truncate">
        {username}
      </div>
      <div className="text-sm text-slate-200">
        {isOnline ? "Available" : "Away"}
      </div>
    </div>
  );
};
export default memo(ConversationHeaderUserInfo);
