import { hardRemoveMessage } from "@/app/_actions/hard-remove-message";
import { softRemoveMessage } from "@/app/_actions/soft-remove-message";
import { useSocket } from "@/context/socket-context";
import { messageActions } from "@/utils/constants/action-lists/message-actions";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { formatMessageDate } from "@/utils/helpers/dateHelpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { FC, memo, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { toast } from "sonner";
import Dialog from "../dialog/dialog";
import Menu from "../menu/menu";
import { MenuPosition } from "../menu/menu.types";
import MessageStatus from "../message-status/messages-status";
import { MessageProps } from "./message.types";

const Message: FC<MessageProps> = (props) => {
  const { message, conversationRelatedData } = props;
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const { socket } = useSocket();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isOpenSoftRemove, setIsOpenSoftRemove] = useState(false);
  const [isOpenHardRemove, setIsOpenHardRemove] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const handleOpenMenu = () => {
    setIsOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setIsOpenMenu(false);
  };
  const openSoftRemoveModal = () => {
    setIsOpenSoftRemove(true);
  };
  const closeSoftRemoveModal = () => {
    setIsOpenSoftRemove(false);
  };
  const openHardRemoveModal = () => {
    setIsOpenHardRemove(true);
  };
  const closeHardRemoveModal = () => {
    setIsOpenHardRemove(false);
  };
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message.content as string);
    toast.success("Copied to Clipboard.");
  };

  const onClickFunctions: { [key: string]: () => void } = {
    edit: () => console.log("edit"),
    copy: handleCopyToClipboard,
    softRemove: openSoftRemoveModal,
    hardRemove: openHardRemoveModal,
  };

  const updatedMessageActions = messageActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));
  const handleSoftRemoveMessage = async () => {
    if (message.id && socket) {
      await softRemoveMessage(message.id);
      toast.success("Message has been successfully soft removed.");
      closeSoftRemoveModal();
    }
  };
  const handleHardRemoveMessage = async () => {
    if (message.id && socket) {
      await hardRemoveMessage(message.id);
      toast.success("Message has been successfully hard removed.");
      emitMessage(socket, {
        action: "hardRemove",
        message: {
          id: message.id,
          senderId: currentUserId,
          receiverId: conversationRelatedData?.secondMemberId as number,
          chatSessionId: conversationRelatedData?.conversationId as number,
        },
      });
      closeHardRemoveModal();
    }
  };
  return (
    <>
      {isOpenSoftRemove && (
        <Dialog
          title="Remove message"
          onClose={closeSoftRemoveModal}
          actions={[
            {
              label: "remove",
              onClick: handleSoftRemoveMessage,
              category: "dismissal",
            },
          ]}
        >
          Are you sure you want to soft remove this message?
        </Dialog>
      )}
      {isOpenHardRemove && (
        <Dialog
          title="Remove message"
          onClose={closeHardRemoveModal}
          actions={[
            {
              label: "remove",
              onClick: handleHardRemoveMessage,
              category: "dismissal",
            },
          ]}
        >
          Are you sure you want to hard remove this message?
        </Dialog>
      )}
      <div
        className={`flex items-start my-1 ${
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
              className={`rounded-xl p-4 max-w-xs md:max-w-sm break-words shadow-md ${
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
                      ? "text-slate-500"
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
            actionList={updatedMessageActions}
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
