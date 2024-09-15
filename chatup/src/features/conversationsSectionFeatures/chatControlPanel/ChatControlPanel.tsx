import { addConversation } from "@/app/_actions/conversationActions/addConversation";
import { restoreCurrentUserConversation } from "@/app/_actions/conversationActions/updateConversation";
import { createMessage } from "@/app/_actions/messageActions/createMessage";
import { editMessage } from "@/app/_actions/messageActions/editMessage";
import EmojiPicker from "@/app/components/emojiPicker/EmojiPicker";
import FileDropArea from "@/app/components/fileDropArea/FileDropArea";
import MessageComposer from "@/app/components/messageComposer/MessageComposer";
import { useMessages } from "@/context/MessageContext";
import { ConversationResponse } from "@/types/ChatSession";
import { MessageResponse } from "@/types/Message";
import { MessageType, globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookiesHelpers";
import { sendMessageSchema } from "@/utils/schemas/sendMessageSchema";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FC, memo, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ChatControlPanelProps } from "./ChatControlPanel.types";

const ChatControlPanel: FC<ChatControlPanelProps> = ({
  conversationRelatedData,
}) => {
  const { addMessage, updateMessage } = useMessages();
  const router = useRouter();
  const { reset, getValues, handleSubmit, setValue } = useFormContext();
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDocumentsUploadPanel, setShowDocumentsUploadPanel] =
    useState(false);

  const toggleEmojiPicker = useCallback(
    () => setShowEmojiPicker((prev) => !prev),
    []
  );
  const toggleDocumentUpload = useCallback(
    () => setShowDocumentsUploadPanel((prev) => !prev),
    []
  );

  const handleCreateMessage = async (
    chatSessionId: number,
    data: z.infer<typeof sendMessageSchema>
  ) => {
    const formData = new FormData();
    formData.append("content", data.message as string);
    formData.append("senderId", currentUserId.toString());
    formData.append("chatSessionId", chatSessionId.toString());
    formData.append("type", MessageType.MANUAL);
    data.files?.forEach((file) => formData.append("files", file));
    try {
      const response = await createMessage(formData);
      console.log(response.data?.data);
      addMessage(response.data?.data as MessageResponse);
      reset();
    } catch (error: any) {
      console.error("Error sending message:", error); // Log the error
      toast.error(error || "Message failed to send");
    }
  };

  const handleEditMessage = async () => {
    const messageId = getValues("id");
    const messageContent = getValues("message");

    try {
      const response = await editMessage(messageId, messageContent);
      updateMessage(response.data?.data as MessageResponse);
      reset();
    } catch (error: any) {
      toast.error(error || "Failed to edit message");
    }
  };

  const handleSendMessage = async (data: z.infer<typeof sendMessageSchema>) => {
    if (!data?.message?.trim() && (!data.files || data.files.length === 0)) {
      return;
    }
    if (data.id) {
      await handleEditMessage();
    } else {
      if (conversationRelatedData.conversationId === "new") {
        const otherMembersIds = [conversationRelatedData.secondMemberId];
        const formData = new FormData();
        formData.append("otherMembersIds", JSON.stringify(otherMembersIds));

        const conversation = (await addConversation(null, formData)) as {
          data: { data: ConversationResponse };
        };
        await handleCreateMessage(conversation.data.data.id, data);
        router.replace(`/conversations/${conversation.data.data.id}`);
      } else {
        if (conversationRelatedData.deletedByCurrentUser) {
          const { data: conversationData } =
            (await restoreCurrentUserConversation(
              conversationRelatedData.conversationId as number
            )) as {
              data: { data: ConversationResponse };
            };
          await handleCreateMessage(conversationData.data.id, data);
        } else {
          await handleCreateMessage(
            conversationRelatedData.conversationId as number,
            data
          );
        }
      }
    }
  };

  const handleAddEmoji = (params: { name: string; emoji: string }) => {
    const { name, emoji } = params;
    setValue(name, getValues(name) + emoji);
  };
  return (
    <>
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{ open: { y: 0 }, closed: { y: "100%" } }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={"absolute bottom-16 left-0"}
          >
            <EmojiPicker
              closeEmojiPicker={toggleEmojiPicker}
              handleEmojiSelect={handleAddEmoji}
              name="message"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDocumentsUploadPanel && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{ open: { y: 0 }, closed: { y: "100%" } }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="z-50 absolute bottom-0 left-0 w-full h-[calc(100vh-4rem)] bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4"
          >
            <FileDropArea
              onClose={toggleDocumentUpload}
              handleSubmitForm={handleSubmit(handleSendMessage)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center sticky bottom-0 bg-gray-900 shadow-lg min-h-16 max-h-40 z-40 px-4 py-2.5">
        <MessageComposer
          handleSubmitForm={handleSubmit(handleSendMessage)}
          openEmojiPicker={toggleEmojiPicker}
          handleUploadDocuments={toggleDocumentUpload}
        />
      </div>
    </>
  );
};

export default memo(ChatControlPanel);
