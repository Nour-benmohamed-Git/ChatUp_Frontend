import { addConversation } from "@/app/_actions/conversationActions/addConversation";
import { restoreCurrentUserConversation } from "@/app/_actions/conversationActions/updateConversation";
import { createMessage } from "@/app/_actions/messageActions/createMessage";
import { editMessage } from "@/app/_actions/messageActions/editMessage";
import EmojiPicker from "@/app/components/emojiPicker/EmojiPicker";
import FileDropArea from "@/app/components/fileDropArea/FileDropArea";
import Menu from "@/app/components/menu/Menu";
import MessageField from "@/app/components/messageField/MessageField";
import { useMessages } from "@/context/MessageContext";
import useAutoSizeTextArea from "@/hooks/useAutoSizeTextArea";
import { ConversationResponse } from "@/types/ChatSession";
import { Message } from "@/types/Message";
import { fileMenuActions } from "@/utils/constants/actionLists/fileMenuActions";
import { MenuPosition, MessageType, globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookiesHelpers";
import { sendMessageSchema } from "@/utils/schemas/sendMessageSchema";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FC, memo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone, FaPlus } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";
import { ChatControlPanelProps } from "./ChatControlPanel.types";

const ChatControlPanel: FC<ChatControlPanelProps> = (props) => {
  const { conversationRelatedData } = props;
  const { addMessage, updateMessage } = useMessages();
  const router = useRouter();
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDocumentsUploadPanel, setShowDocumentsUploadPanel] =
    useState(false);
  const { watch, reset, getValues, setValue, handleSubmit } = useFormContext();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoSizeTextArea(textAreaRef.current, getValues("message"));
  const openEmojiPicker = () => {
    setShowEmojiPicker(true);
  };
  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
  };
  const handleSendLocation = () => {
    console.log("location");
  };
  const handleUploadDocuments = () => {
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
  const handleCreateMessage = async (
    chatSessionId: number,
    data: z.infer<typeof sendMessageSchema>,
    conversation?: ConversationResponse
  ) => {
    const messageToCreate = {
      content: data.message,
      files: data.files,
      senderId: currentUserId,
      chatSessionId,
      type: MessageType.MANUAL,
    };

    const formData = new FormData();
    Object.entries(messageToCreate).forEach(([key, value]) => {
      if (key !== "files") {
        formData.append(key, value as any);
      }
    });
    messageToCreate.files?.forEach((file: File) => {
      formData.append("files", file);
    });
    await createMessage(formData)
      .then((res) => {
        if (conversation) {
          addMessage(res.data?.data as Message);
        } else {
          addMessage(res.data?.data as Message);
        }
        reset();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleEditMessage = async () => {
    await editMessage(getValues("id"), getValues("message"))
      .then((res) => {
        updateMessage(res.data?.data as Message);
        reset();
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleSendMessage = async (data: z.infer<typeof sendMessageSchema>) => {
    if (
      getValues("message").trim().length == 0 &&
      (!getValues("files") || getValues("files").length === 0)
    ) {
      return;
    }
    if (!data.id) {
      if (conversationRelatedData.conversationId === "new") {
        const formData = new FormData();
        formData.append(
          "otherMembersIds",
          conversationRelatedData.secondMemberId as string
        );
        const conversation = (await addConversation(null, formData)) as {
          data: { data: ConversationResponse };
        };
        if (conversation && conversationRelatedData?.secondMemberId) {
          await handleCreateMessage(
            conversation.data.data.id,
            data,
            conversation.data.data
          );
          const queryParams = `secondMemberId=${
            conversationRelatedData?.secondMemberId as number
          }`;
          router.replace(
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
          handleCreateMessage(conversation.data.data.id, data);
        } else {
          handleCreateMessage(
            conversationRelatedData.conversationId as number,
            data
          );
        }
      }
    } else {
      handleEditMessage();
    }
  };

  const onSubmit = async (data: z.infer<typeof sendMessageSchema>) => {
    handleSendMessage(data);
  };

  const handleAddEmoji = (params: { name: string; emoji: string }) => {
    const { name, emoji } = params;
    setValue(name, getValues(name) + emoji);
  };
  return (
    <>
      <AnimatePresence>
        {showEmojiPicker ? (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{ open: { y: 0 }, closed: { y: "100%" } }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={"absolute bottom-16 left-0"}
          >
            <EmojiPicker
              closeEmojiPicker={closeEmojiPicker}
              handleEmojiSelect={handleAddEmoji}
              name="message"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex items-center sticky bottom-0 bg-gray-900 shadow-lg min-h-16 max-h-40 z-40 px-4 py-2.5">
        <div className="flex items-center justify-center h-full w-full gap-5">
          <AnimatePresence>
            {showDocumentsUploadPanel ? (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{ open: { y: 0 }, closed: { y: "100%" } }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className={
                  "z-50 absolute bottom-0 left-0 w-full h-[calc(100vh-4rem)] bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4"
                }
              >
                <FileDropArea
                  onClose={handleClosePhotosAndVideosUpload}
                  handleSendMessage={handleSubmit(onSubmit)}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="flex gap-4 md:gap-6 h-full">
            <button onClick={openEmojiPicker}>
              <motion.div
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
                <MdEmojiEmotions size={24} />
              </motion.div>
            </button>
            <Menu
              actionList={updatedFileMenuActions}
              position={MenuPosition.TOP_RIGHT}
              icon={FaPlus}
            />
          </div>
          <MessageField
            id="message"
            name="message"
            placeholder="Type your message"
            messageFieldRef={textAreaRef}
            handleSendMessage={handleSubmit(onSubmit)}
          />
          {watch("message").trim().length !== 0 ? (
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300"
            >
              <BsFillSendFill size={24} />
            </button>
          ) : (
            <button className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
              <FaMicrophone size={24} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default memo(ChatControlPanel);
