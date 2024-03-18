import { FC, memo } from "react";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import { MessageStatusProps } from "./messages-status.types";

const MessageStatus: FC<MessageStatusProps> = (props) => {
  const { currentUserId, message } = props;
  if (
    !currentUserId ||
    !message ||
    !message.senderId ||
    message.senderId !== currentUserId
  ) {
    return null;
  }

  return message.readStatus ? (
    <FaCheckCircle className="text-xs mt-2 rounded-full text-gold-900" />
  ) : (
    <FaRegCheckCircle className="text-xs mt-2 rounded-full text-gold-900" />
  );
};

export default memo(MessageStatus);
