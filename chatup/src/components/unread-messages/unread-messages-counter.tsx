import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { FC, memo } from "react";
import { UnreadMessagesCounterProps } from "./unread-messages-counter.types";

const UnreadMessagesCounter: FC<UnreadMessagesCounterProps> = (props) => {
  const { chatSession } = props;
  const currentUserId = Number(getItem(globals.currentUserId));
  if (chatSession?.lastMessage?.senderId === currentUserId) {
    return null;
  }

  return chatSession?.count ? (
    <span className="flex items-center justify-center rounded-full bg-gold-600 h-7 w-7 text-xs font-medium text-gray-900">
      {chatSession?.count}
    </span>
  ) : null;
};

export default memo(UnreadMessagesCounter);
