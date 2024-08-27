import { forwardMessage } from "@/app/_actions/messageActions/forwardMessage";
import { hardDeleteMessage } from "@/app/_actions/messageActions/hardDeleteMessage";
import { softRemoveMessage } from "@/app/_actions/messageActions/softRemoveMessage";
import Avatar from "@/app/components/avatar/Avatar";
import Dialog from "@/app/components/dialog/Dialog";
import FileDisplay from "@/app/components/fileDisplay/FileDisplay";
import Menu from "@/app/components/menu/Menu";
import MessageReactionSelector from "@/app/components/messageReactionSelector/MessageReactionSelector";
import MessageStatus from "@/app/components/messageStatus/MessageStatus";
import SystemMessage from "@/app/components/systemMessage/SystemMessage";
import { useMessages } from "@/context/MessageContext";
import { useSocket } from "@/context/SocketContext";
import { Message } from "@/types/Message";
import { messageActions } from "@/utils/constants/actionLists/messageActions";
import { MenuPosition, MessageType, globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookiesHelpers";
import { formatMessageDate } from "@/utils/helpers/dateHelpers";
import { emitForwardedMessage } from "@/utils/helpers/socket-helpers";
import { FC, memo, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { toast } from "sonner";
import ReactionList from "../reactionList/ReactionList";
import UsersPicker from "../usersPicker/UsersPicker";
import styles from "./MessageItem.module.css";
import { MessageItemProps } from "./MessageItem.types";

const MessageItem: FC<MessageItemProps> = (props) => {
  const {
    message,
    combinedData,
    conversationRelatedData,
    highlight,
    isHighlighted,
    initialFriends,
  } = props;
  const { hardRemoveMessage } = useMessages();

  const [tapCoordinates, setTapCoordinates] = useState<{
    x: number;
    y: number;
  }>();
  const { setValue } = useFormContext();
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const { socket } = useSocket();
  const [openSoftRemove, setOpenSoftRemove] = useState(false);
  const [openHardRemove, setOpenHardRemove] = useState(false);
  const [openForwardMessage, setOpenForwardMessage] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const methods = useForm({
    defaultValues: {
      otherMembersIds: [],
    },
  });
  const openForwardMessageModal = () => {
    setOpenForwardMessage(true);
  };
  const closeForwardMessageModal = () => {
    methods.setValue("otherMembersIds", []);
    setOpenForwardMessage(false);
  };
  const openSoftRemoveModal = () => {
    setOpenSoftRemove(true);
  };
  const closeSoftRemoveModal = () => {
    setOpenSoftRemove(false);
  };
  const openHardRemoveModal = () => {
    setOpenHardRemove(true);
  };
  const closeHardRemoveModal = () => {
    setOpenHardRemove(false);
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
    forward: openForwardMessageModal,
    softRemove: openSoftRemoveModal,
    hardRemove: openHardRemoveModal,
  };

  const updatedMessageActions = messageActions
    .filter((action) => {
      if (currentUserId && message.senderId !== currentUserId) {
        return !["edit", "hardRemove"].includes(action.label);
      }
      return true;
    })
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

  const handleForwardMessage = async () => {
    if (message.id && socket) {
      const forwardedMessages = (await forwardMessage(
        message.id,
        methods.getValues("otherMembersIds")
      )) as { data: { data: Message[] } };
      emitForwardedMessage(socket, {
        forwardedMessages: forwardedMessages.data?.data,
      });
      closeForwardMessageModal();
    }
  };

  const handleHardRemoveMessage = async () => {
    if (message.id && socket) {
      await hardDeleteMessage(message.id);
      toast.success("Message has been successfully hard removed.");
      hardRemoveMessage({
        id: message.id,
        senderId: currentUserId,
        chatSessionId: conversationRelatedData?.conversationId as number,
      } as Message);
      closeHardRemoveModal();
    }
  };
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return [text]; // Return the entire text if no highlight is provided

    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters
    const regex = new RegExp(`(${escapedHighlight})`, "gi"); // Remove word boundary to match partial words

    // Split text into parts based on the regex
    const parts = text.split(regex);

    // Map through parts to apply highlighting
    return parts.map((part, index) =>
      regex.test(part.toLowerCase()) ? (
        <span key={index} className="bg-indigo-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  const messageContent = useMemo(
    () => getHighlightedText(message.content || "", highlight || ""),
    [message.content, highlight]
  );
  const timerRef = useRef<number | null>(null);

  const handlePressStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTapCoordinates({ x: touch.clientX, y: touch.clientY });
    // Set a timer to show the reaction picker after 300ms
    timerRef.current = window.setTimeout(
      () => setShowReactionPicker(true),
      300
    );
  };

  const handlePressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <>
      {openForwardMessage && (
        <Dialog
          title="Forward message to"
          onClose={closeForwardMessageModal}
          actions={[
            {
              label: "forward",
              onClick: handleForwardMessage,
              category: "confirmation",
            },
          ]}
        >
          <FormProvider {...methods}>
            <UsersPicker initialFriends={initialFriends} />
          </FormProvider>
        </Dialog>
      )}
      {openSoftRemove && (
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
      {openHardRemove && (
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
      {message.type === MessageType.MANUAL ? (
        <div className="flex flex-col w-full gap-1">
          <div
            className={`flex w-full items-start my-3 ${
              currentUserId && message.senderId != currentUserId
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`flex items-center w-full gap-2 ${
                currentUserId && message.senderId != currentUserId
                  ? "flex-row"
                  : "flex-row-reverse"
              }`}
            >
              <div className="flex gap-2 max-w-[calc(100%-2rem)] md:max-w-md lg:max-w-lg">
                {currentUserId && message.senderId != currentUserId && (
                  <Avatar
                    additionalClasses="h-6 md:h-10 w-6 md:w-10"
                    rounded="rounded-full"
                    fileName={
                      combinedData?.members?.[message.senderId as number]
                        .profilePicture
                    }
                  />
                )}
                <div
                  onTouchStart={handlePressStart}
                  onTouchEnd={handlePressEnd} // Handle case where tap is canceled
                  className={`relative rounded-xl p-4 w-full shadow-md ${
                    currentUserId && message.senderId != currentUserId
                      ? "bg-gold-400 text-gray-950 rounded-tl-none max-w-[calc(100%-2rem)] md:max-w-[calc(100%-3rem)]"
                      : "bg-slate-900 text-white rounded-tr-none"
                  } ${isHighlighted ? styles.animatePulseOnce : ""}`}
                >
                  <FileDisplay
                    files={message?.files}
                    messageDetails={{
                      senderId: message?.senderId,
                      timestamp: message.timestamp,
                    }}
                  />
                  <p className="text-sm break-words">{messageContent}</p>
                  <div className="flex justify-end mt-2">
                    <span
                      className={`flex flex-row-reverse text-xs ${
                        currentUserId && message.senderId != currentUserId
                          ? "text-slate-500"
                          : "text-gold-900"
                      }`}
                    >
                      {formatMessageDate(message.timestamp)}
                    </span>
                  </div>
                  {message.reactions && (
                    <ReactionList
                      position={
                        currentUserId && message.senderId != currentUserId
                          ? MenuPosition.TOP_RIGHT
                          : MenuPosition.TOP_LEFT
                      }
                      reactions={message.reactions}
                    />
                  )}
                </div>
              </div>
              <Menu
                actionList={updatedMessageActions}
                position={
                  currentUserId && message.senderId != currentUserId
                    ? MenuPosition.TOP_RIGHT
                    : MenuPosition.TOP_LEFT
                }
                icon={BiDotsVerticalRounded}
              />
              <MessageReactionSelector
                reactionSelectorPosition={tapCoordinates}
                position={
                  currentUserId && message.senderId != currentUserId
                    ? MenuPosition.TOP_RIGHT
                    : MenuPosition.TOP_LEFT
                }
                showReactionPicker={showReactionPicker}
                setShowReactionPicker={setShowReactionPicker}
                message={message}
                conversationRelatedData={conversationRelatedData}
              />
              {message.edited && (
                <div className="flex justify-center items-center rounded-full h-8 w-8 text-gold-900">
                  <MdEdit size={20} />
                </div>
              )}
            </div>
          </div>
          <MessageStatus message={message} />
        </div>
      ) : (
        <SystemMessage combinedData={combinedData} />
      )}
    </>
  );
};
export default memo(MessageItem);
