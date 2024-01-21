import { conversationActions } from "@/utils/constants/conversation-actions";
import { FC, memo } from "react";
import BlocContainer from "../bloc-container/bloc-container";
import { ChatConversationProps } from "./chat-conversation.types";

const ChatConversation: FC<ChatConversationProps> = (props) => {
  const {chatId}=props
  return (
    <main id="main_content" className="col-span-2 h-screen">
      <BlocContainer
        actions={conversationActions}
        hasChatControlPanel
        height="calc(100% - 8rem)"
        paddingClass="px-8 py-4"
      >
        Chat Conversation
      </BlocContainer>
    </main>
  );
};
export default memo(ChatConversation);
