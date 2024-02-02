import { MessageActions } from "@/utils/constants/action-lists/message-actions";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { formatMessageDate } from "@/utils/helpers/dateHelpers";
import { FC, memo, useState } from "react";
import Popover from "../popover/popover";
import { ConversationMessageProps } from "./conversation-message.types";
import { PopoverPosition } from "../popover/popover.types";

const ConversationMessage: FC<ConversationMessageProps> = (props) => {
  const { message } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUserId = Number(getItem(globals.currentUserId));
  return (
    <div
      className={`flex items-start mb-4 ${
        currentUserId && message.senderId === currentUserId
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`flex items-center ${
          currentUserId && message.senderId === currentUserId
            ? "flex-row-reverse"
            : "flex-row"
        } gap-2`}
      >
        <div className="flex flex-col">
          <div
            className={`rounded-xl p-4 max-w-xs md:max-w-sm break-words ${
              currentUserId && message.senderId === currentUserId
                ? "bg-slate-900 text-white rounded-tr-none"
                : "bg-gold-400 text-gray-950 rounded-tl-none"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span
              className={`flex flex-row-reverse text-xs mt-2 ${
                currentUserId && message.senderId === currentUserId
                  ? "text-gold-900"
                  : "text-slate-400"
              }`}
            >
              {formatMessageDate(message.timestamp)}
            </span>
          </div>
        </div>
        <Popover
          actionList={MessageActions}
          position={
            currentUserId && message.senderId === currentUserId
              ? PopoverPosition.BOTTOM_RIGHT
              : PopoverPosition.BOTTOM_LEFT
          }
        />
      </div>
    </div>
  );
};
export default memo(ConversationMessage);
