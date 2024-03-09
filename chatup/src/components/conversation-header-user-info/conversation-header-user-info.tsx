import { FC, memo } from "react";
import { ConversationHeaderUserInfoProps } from "./conversation-header-user-info.types";
const ConversationHeaderUserInfo: FC<ConversationHeaderUserInfoProps> = (
  props
) => {
  const { username, lastSeen } = props;
  return (
    <div className="flex flex-col">
      <div className="text-sm text-gold-600 w-32  md:w-44 truncate">
        {username}
      </div>
      <div className="text-sm text-slate-200">last seen {lastSeen}</div>
    </div>
  );
};
export default memo(ConversationHeaderUserInfo);
