import { FC, memo } from "react";
import { ConversationHeaderUserInfoProps } from "./conversation-header-user-info.types";
const ConversationHeaderUserInfo: FC<ConversationHeaderUserInfoProps> = (
  props
) => {
  const { username, lastSeen } = props;
  return (
    <div className="flex flex-col">
      <div className="text-sm text-gold-600">{username}</div>
      <div className="text-sm text-slate-400">last seen{lastSeen}</div>
    </div>
  );
};
export default memo(ConversationHeaderUserInfo);
