import { addConversation } from "@/app/_actions/conversationActions/addConversation";
import { updateConversation } from "@/app/_actions/conversationActions/updateConversation";
import { addMessage } from "@/app/_actions/messageActions/addMessage";
import { updateMessage } from "@/app/_actions/messageActions/updateMessage";
import EmojiPicker from "@/app/components/emoji-picker/emoji-picker";
import MessageField from "@/app/components/message-field/message-field";
import { useSocket } from "@/context/socket-context";
import useAutoSizeTextArea from "@/hooks/useAutoSizeTextArea";
import { chatControlPanelActions } from "@/utils/constants/action-lists/chatControlPanelActions";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { motion } from "framer-motion";
import { FC, memo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { toast } from "sonner";
import { ChatControlPanelProps } from "./ChatControlPanel.types";

const ChatControlPanel: FC<ChatControlPanelProps> = (props) => {
  const { conversationRelatedData } = props;
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { socket } = useSocket();
  const { watch, setValue } = useFormContext();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoSizeTextArea(textAreaRef.current, watch("message"));
  const openEmojiPicker = () => {
    setShowEmojiPicker(true);
  };
  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
  };
  const onClickFunctions: { [key: string]: () => void } = {
    emojiPicker: () => openEmojiPicker(),
    addFiles: () => console.log("add files"),
  };

  const updatedChatControlPanelActions = chatControlPanelActions.map(
    (action) => ({
      ...action,
      onClick: onClickFunctions[action.label],
    })
  );
  const createMessage = async (
    chatSessionId: number,
    participantsData?: { [userId: string]: string }
  ) => {
    await addMessage({
      content: watch("message"),
      senderId: currentUserId,
      receiverId: conversationRelatedData?.secondMemberId as number,
      chatSessionId,
    })
      .then((res) => {
        socket &&
          emitMessage(socket, {
            action: "create",
            message: res?.data,
            participantsData: participantsData,
          });
        setValue("message", "");
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleSendMessage = async () => {
    if (!watch("message")) {
      return;
    }
    if (!watch("id")) {
      if (!conversationRelatedData.conversationId) {
        const conversation = await addConversation({
          secondMemberId: conversationRelatedData.secondMemberId as number,
        });
        console.log("conversation", conversation);
        if (conversation && conversationRelatedData?.secondMemberId) {
          createMessage(
            conversation.data.id,
            conversation?.data.participantsData
          );
          const queryParams = `deletedByCurrentUser=${
            conversation.data.deletedByCurrentUser
          }&secondMemberId=${
            conversationRelatedData?.secondMemberId as number
          }`;
          window.history.replaceState(
            {},
            "",
            `/conversations/${conversation.data.id}?${queryParams}`
          );
        }
      } else {
        if (
          conversationRelatedData?.conversationId &&
          conversationRelatedData?.deletedByCurrentUser
        ) {
          const conversation = await updateConversation(
            conversationRelatedData.conversationId as number
          );
          createMessage(conversation.data.id);
        } else {
          createMessage(conversationRelatedData.conversationId as number);
        }
      }
    } else {
      updateMessage(watch("id"), watch("message"));
    }
  };
  return (
    <div className="flex items-center sticky bottom-0 bg-gray-900 shadow-lg min-h-16 max-h-40 z-40 px-4 py-2.5 rounded-t-md ">
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
        <div className="flex gap-7 h-full">
          {updatedChatControlPanelActions.map((action) => (
            <button key={action.label} onClick={action.onClick}>
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
    </div>
  );
};
export default memo(ChatControlPanel);
