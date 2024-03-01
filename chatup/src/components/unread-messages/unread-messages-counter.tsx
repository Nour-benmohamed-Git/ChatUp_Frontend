import { FC, memo } from "react";
import { UnreadMessagesCounterProps } from "./unread-messages-counter.types";

const UnreadMessagesCounter: FC<UnreadMessagesCounterProps> = (props) => {
  const { conversation, currentUserId } = props;
  if (conversation?.senderId === currentUserId) {
    return null;
  }
  return conversation?.count ? (
    <span className="flex items-center justify-center rounded-full bg-gold-600 h-7 w-7 text-xs font-medium text-gray-900">
      {conversation?.count}
    </span>
  ) : null;
};

export default memo(UnreadMessagesCounter);
