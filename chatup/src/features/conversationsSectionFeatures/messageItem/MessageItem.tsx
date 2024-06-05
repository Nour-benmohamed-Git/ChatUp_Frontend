import { hardRemoveMessage } from "@/app/_actions/messageActions/hardRemoveMessage";
import { softRemoveMessage } from "@/app/_actions/messageActions/softRemoveMessage";
import Dialog from "@/app/components/dialog/dialog";
import FileDisplay from "@/app/components/fileDisplay/FileDisplay";
import Menu from "@/app/components/menu/menu";
import { MenuPosition } from "@/app/components/menu/menu.types";
import MessagesStatus from "@/app/components/message-status/messages-status";
import { useSocket } from "@/context/socket-context";
import { messageActions } from "@/utils/constants/action-lists/messageActions";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { formatMessageDate } from "@/utils/helpers/dateHelpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { FC, memo, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { toast } from "sonner";
import { MessageItemProps } from "./MessageItem.types";
import { getUserById } from "@/app/_actions/userActions/getUserById";
import { UserResponse } from "@/types/User";

const MessageItem: FC<MessageItemProps> = (props) => {
  const { message, conversationRelatedData } = props;
  const { setValue } = useFormContext();
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const { socket } = useSocket();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isOpenSoftRemove, setIsOpenSoftRemove] = useState(false);
  const [isOpenHardRemove, setIsOpenHardRemove] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [senderData, setSenderData] = useState<UserResponse>();

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
  const handleEditMessage = () => {
    setValue("id", message.id);
    setValue("message", message.content);
  };

  const onClickFunctions: { [key: string]: () => void } = {
    edit: handleEditMessage,
    copy: handleCopyToClipboard,
    softRemove: openSoftRemoveModal,
    hardRemove: openHardRemoveModal,
  };

  const updatedMessageActions = messageActions
    // .filter((action) => {
    //   if (message.senderId === conversationRelatedData.secondMemberId) {
    //     return action.label !== "softRemove";
    //   }
    //   return true;
    // })
    .map((action) => ({
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

  const getSenderData = async (senderId: string) => {
    const res = await getUserById(`${message.senderId}`);
    setSenderData(res.data);
  };

  useEffect(() => {
    getSenderData(`${message.senderId}`);
  }, [message.senderId]);
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
          <div
            className={`rounded-xl p-4 max-w-xs md:max-w-sm break-words shadow-md ${
              currentUserId && message.senderId != currentUserId
                ? "bg-gold-400 text-gray-950 rounded-tl-none"
                : "bg-slate-900 text-white rounded-tr-none"
            }`}
          >
            <FileDisplay
              files={message?.files}
              messageDetails={{
                senderPicture: senderData?.profilePicture,
                senderName: senderData?.username as string,
                timestamp: message.timestamp,
              }}
            />
            <p className="text-sm">{message?.content}</p>
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
              <MessagesStatus currentUserId={currentUserId} message={message} />
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
        </div>
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
    </>
  );
};
export default memo(MessageItem);
