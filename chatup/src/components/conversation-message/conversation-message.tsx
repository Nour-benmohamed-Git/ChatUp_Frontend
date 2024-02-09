import { MessageActions } from "@/utils/constants/action-lists/message-actions";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { formatMessageDate } from "@/utils/helpers/dateHelpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { FC, memo, useState } from "react";
import Dialog from "../dialog/dialog";
import Popover from "../popover/popover";
import { PopoverPosition } from "../popover/popover.types";
import { ConversationMessageProps } from "./conversation-message.types";

const ConversationMessage: FC<ConversationMessageProps> = (props) => {
  const { message, socket } = props;
  const currentUserId = Number(getItem(globals.currentUserId));
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const onClickFunctions: { [key: string]: () => void } = {
    edit: () => console.log("edit"),
    copy: () => console.log("copy"),
    remove: openModal,
  };

  const updatedMessageActions = MessageActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  const handleRemoveMessage = () => {
    if (message.id) {
      emitMessage(socket, {
        action: "remove",
        data: {
          content: message.id,
          senderId: currentUserId,
          chatSessionId: message.chatSessionId,
        },
        room: message.chatSessionId as number,
      });
      closeModal();
    }
  };
  return (
    <>
      {isOpen && (
        <Dialog
          title="Remove message"
          onClose={closeModal}
          actions={[
            {
              label: "remove",
              onClick: handleRemoveMessage,
              category: "dismissal",
            },
          ]}
        >
          Are you sure you want to remove this message?
        </Dialog>
      )}
      <div
        className={`flex items-start mb-4 ${
          currentUserId && message.senderId != currentUserId
            ? "justify-start"
            : "justify-end"
        }`}
      >
        <div
          className={`flex items-center ${
            currentUserId && message.senderId != currentUserId
              ? "flex-row"
              : "flex-row-reverse"
          } gap-2`}
        >
          <div className="flex flex-col">
            <div
              className={`rounded-xl p-4 max-w-xs md:max-w-sm break-words ${
                currentUserId && message.senderId != currentUserId
                  ? "bg-gold-400 text-gray-950 rounded-tl-none"
                  : "bg-slate-900 text-white rounded-tr-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span
                className={`flex flex-row-reverse text-xs mt-2 ${
                  currentUserId && message.senderId != currentUserId
                    ? "text-slate-400"
                    : "text-gold-900"
                }`}
              >
                {formatMessageDate(message.timestamp)}
              </span>
            </div>
          </div>
          <Popover
            actionList={updatedMessageActions}
            position={
              currentUserId && message.senderId != currentUserId
                ? PopoverPosition.BOTTOM_LEFT
                : PopoverPosition.BOTTOM_RIGHT
            }
          />
        </div>
      </div>
    </>
  );
};
export default memo(ConversationMessage);
