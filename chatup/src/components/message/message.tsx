import { messageActions } from "@/utils/constants/action-lists/message-actions";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { formatMessageDate } from "@/utils/helpers/dateHelpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { FC, memo, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Dialog from "../dialog/dialog";
import Menu from "../menu/menu";
import { MenuPosition } from "../menu/menu.types";
import MessageStatus from "../message-status/messages-status";
import { MessageProps } from "./message.types";

const Message: FC<MessageProps> = (props) => {
  const { message, socket, selectedChatItem } = props;
  const currentUserId = Number(getItem(globals.currentUserId));
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const handleOpenMenu = () => {
    setIsOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setIsOpenMenu(false);
  };
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

  const updatedmessageActions = messageActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  const handleRemoveMessage = () => {
    if (message.id) {
      emitMessage(socket, {
        action: "remove",
        data: {
          id: message.id,
          senderId: currentUserId,
          receiverId: selectedChatItem?.secondMemberId,
          chatSessionId: selectedChatItem?.chatId,
        },
        room: selectedChatItem?.chatId,
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
              <div className="flex items-center justify-end gap-2">
                <span
                  className={`flex flex-row-reverse text-xs mt-2 ${
                    currentUserId && message.senderId != currentUserId
                      ? "text-slate-400"
                      : "text-gold-900"
                  }`}
                >
                  {formatMessageDate(message.timestamp)}
                </span>
                <MessageStatus
                  currentUserId={currentUserId}
                  message={message}
                />
              </div>
            </div>
          </div>
          <div
            ref={buttonRef}
            role="button"
            onClick={handleOpenMenu}
            className="flex justify-center items-center rounded-full h-8 w-8 bg-slate-900 text-gold-900"
          >
            <BiDotsVerticalRounded size={20} />
          </div>
          <Menu
            actionList={updatedmessageActions}
            isOpen={isOpenMenu}
            onClose={handleCloseMenu}
            buttonRef={buttonRef}
            position={
              currentUserId && message.senderId != currentUserId
                ? MenuPosition.TOP_RIGHT
                : MenuPosition.TOP_LEFT
            }
          />
        </div>
      </div>
    </>
  );
};
export default memo(Message);
