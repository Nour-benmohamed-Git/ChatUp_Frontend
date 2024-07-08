import { FC, memo } from "react";
import { UnreadMessagesCounterProps } from "./UnreadMessagesCounter.types";

const UnreadMessagesCounter: FC<UnreadMessagesCounterProps> = (props) => {
  const { conversation, currentUserId } = props;
  if (conversation?.senderId === currentUserId) {
    return null;
  }
  return conversation?.unreadMessagesCount ? (
    <span className="flex items-center justify-center rounded-full bg-gold-600 h-7 w-7 text-xs font-medium text-gray-900">
      {conversation?.unreadMessagesCount}
    </span>
  ) : null;
};

export default memo(UnreadMessagesCounter);
