import { FC, memo } from "react";
import Avatar from "../avatar/Avatar";
import { MessageStatusProps } from "./MessageStatus.types";

const MessageStatus: FC<MessageStatusProps> = (props) => {
  const { message } = props;

  return message?.readBy && message.readBy.length > 0 ? (
    <div className="flex gap-2 items-center justify-end ">
      {message.readBy.map((item, index) => (
        <Avatar
          key={`${item.username + index}`}
          additionalClasses="h-4 w-4"
          rounded="rounded-full"
          fileName={item?.profilePicture}
        />
      ))}
    </div>
  ) : null;
};

export default memo(MessageStatus);
