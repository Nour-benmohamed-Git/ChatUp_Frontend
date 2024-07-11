import { addConversation } from "@/app/_actions/conversationActions/addConversation";
import { restoreCurrentUserConversation } from "@/app/_actions/conversationActions/updateConversation";
import { addMessage } from "@/app/_actions/messageActions/addMessage";
import { updateMessage } from "@/app/_actions/messageActions/updateMessage";
import EmojiPicker from "@/app/components/emojiPicker/EmojiPicker";
import FileDropArea from "@/app/components/fileDropArea/FileDropArea";
import Menu from "@/app/components/menu/Menu";
import MessageField from "@/app/components/messageField/MessageField";
import { useSocket } from "@/context/SocketContext";
import useAutoSizeTextArea from "@/hooks/useAutoSizeTextArea";
import { ConversationResponse } from "@/types/ChatSession";
import { Message } from "@/types/Message";
import { chatControlPanelActions } from "@/utils/constants/actionLists/chatControlPanelActions";
import { fileMenuActions } from "@/utils/constants/actionLists/fileMenuActions";
import { MenuPosition, globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookiesHelpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { motion } from "framer-motion";
import { FC, RefObject, memo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { toast } from "sonner";
import { ChatControlPanelProps } from "./ChatControlPanel.types";

const ChatControlPanel: FC<ChatControlPanelProps> = (props) => {
  const { conversationRelatedData, messageListRef } = props;
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDocumentsUploadPanel, setShowDocumentsUploadPanel] =
    useState(false);
  const { socket } = useSocket();
  const { watch, reset, getValues, setValue } = useFormContext();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoSizeTextArea(textAreaRef.current, getValues("message"));
  const openEmojiPicker = () => {
    setShowEmojiPicker(true);
  };
  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
  };
  const handleOpenMenu = () => {
    setIsOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setIsOpenMenu(false);
  };
  const additionalParams: {
    [key: string]: { onClick: () => void; ref?: RefObject<HTMLDivElement> };
  } = {
    emojiPicker: { onClick: openEmojiPicker },
    addFiles: { onClick: handleOpenMenu, ref: buttonRef },
  };

  const updatedChatControlPanelActions = chatControlPanelActions.map(
    (action) => ({
      ...action,
      onClick: additionalParams[action.label].onClick,
      ref: additionalParams[action.label].ref,
    })
  );
  const handleSendLocation = () => {
    console.log("location");
  };
  const handleUploadDocuments = () => {
    console.log("second");
    setShowDocumentsUploadPanel(true);
  };
  const handleClosePhotosAndVideosUpload = () => {
    setShowDocumentsUploadPanel(false);
    setValue("files", []);
  };
  const handleCameraUpload = () => {
    console.log("second");
  };
  const onClickFunctions: { [key: string]: () => void } = {
    location: handleSendLocation,
    documents: handleUploadDocuments,
    camera: handleCameraUpload,
  };

  const updatedFileMenuActions = fileMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));
  const createMessage = async (chatSessionId: number) => {
    const messageToCreate = {
      content: getValues("message"),
      files: getValues("files"),
      senderId: currentUserId,
      receiverId: conversationRelatedData?.secondMemberId as number,
      chatSessionId,
    };

    const formData = new FormData();
    Object.entries(messageToCreate).forEach(([key, value]) => {
      if (key !== "files") {
        formData.append(key, value);
      }
    });
    messageToCreate.files?.forEach((file: File) => {
      formData.append("files", file);
    });
    await addMessage(formData)
      .then((res) => {
        socket &&
          emitMessage(socket, {
            action: "create",
            message: res.data?.data as Message,
          });
        reset();
        if (messageListRef?.current) {
          messageListRef.current?.scrollTo({
            top: messageListRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const editMessage = async (chatSessionId: number) => {
    const messageToEdit = {
      id: getValues("id"),
      content: getValues("message"),
      files: getValues("files"),
      senderId: currentUserId,
      receiverId: conversationRelatedData?.secondMemberId as number,
      chatSessionId,
    };

    await updateMessage(getValues("id"), getValues("message"))
      .then(() => {
        socket &&
          emitMessage(socket, {
            action: "edit",
            message: messageToEdit,
          });
        reset();
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleSendMessage = async () => {
    if (!getValues("message") && !getValues("files")) {
      return;
    }
    if (!getValues("id")) {
      if (!conversationRelatedData.conversationId) {
        const conversation = (await addConversation({
          secondMemberId: conversationRelatedData.secondMemberId as number,
        })) as {
          data: { data: ConversationResponse };
        };
        if (conversation && conversationRelatedData?.secondMemberId) {
          createMessage(conversation.data.data.id);
          const queryParams = `deletedByCurrentUser=${
            conversation.data.data.deletedByCurrentUser
          }&secondMemberId=${
            conversationRelatedData?.secondMemberId as number
          }`;
          window.history.replaceState(
            {},
            "",
            `/conversations/${conversation.data.data.id}?${queryParams}`
          );
        }
      } else {
        if (conversationRelatedData?.deletedByCurrentUser) {
          const conversation = (await restoreCurrentUserConversation(
            conversationRelatedData.conversationId as number
          )) as {
            data: { data: ConversationResponse };
          };
          createMessage(conversation.data.data.id);
        } else {
          createMessage(conversationRelatedData.conversationId as number);
        }
      }
    } else {
      editMessage(conversationRelatedData.conversationId as number);
    }
  };
  return (
    <div className="flex items-center sticky bottom-0 bg-gray-900 shadow-lg min-h-16 max-h-40 z-40 px-4 py-2.5">
      <div className="flex items-center justify-center h-full w-full gap-5">
        {showEmojiPicker ? (
          <motion.div
            initial="closed"
            animate={showEmojiPicker ? "open" : "closed"}
            variants={{ open: { y: 0 }, closed: { y: "100%" } }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={"absolute bottom-full left-0"}
          >
            <EmojiPicker closeEmojiPicker={closeEmojiPicker} />
          </motion.div>
        ) : null}

        {showDocumentsUploadPanel ? (
          <motion.div
            initial="closed"
            animate={showDocumentsUploadPanel ? "open" : "closed"}
            variants={{ open: { y: 0 }, closed: { y: "100%" } }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={
              "z-50 absolute bottom-0 left-0 w-full h-[calc(100vh-4rem)] bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4"
            }
          >
            <FileDropArea
              onClose={handleClosePhotosAndVideosUpload}
              handleSendMessage={handleSendMessage}
            />
          </motion.div>
        ) : null}
        <div className="flex gap-7 h-full">
          {updatedChatControlPanelActions.map((action) => (
            <button key={action.label} onClick={action.onClick}>
              <motion.div
                ref={action.ref}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.5,
                  rotate: 360,
                }}
                className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300"
              >
                {action.icon}
              </motion.div>
            </button>
          ))}
        </div>
        <MessageField
          id="message"
          name="message"
          placeholder="Type your message"
          messageFieldRef={textAreaRef}
        />
        {watch("message") ? (
          <button onClick={handleSendMessage}>
            <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
              <BsFillSendFill size={24} />
            </div>
          </button>
        ) : (
          <button>
            <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
              <FaMicrophone size={24} />
            </div>
          </button>
        )}
      </div>

      <Menu
        actionList={updatedFileMenuActions}
        isOpen={isOpenMenu}
        onClose={handleCloseMenu}
        buttonRef={buttonRef}
        position={MenuPosition.TOP_RIGHT}
      />
    </div>
  );
};
export default memo(ChatControlPanel);
