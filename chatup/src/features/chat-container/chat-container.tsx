"use client";
import { ChatItem } from "@/types/ChatItem";
import { FC, useState } from "react";
import ChatConversation from "../chat-conversation/chat-conversation";
import ChatListSidebar from "../chat-list-sidebar/chat-list-sidebar";

const ChatContainer: FC = () => {
  const [selectedChatItem, setSelectedChatItem] = useState<ChatItem>({
    chatId: -1,
    secondMemberId: 0,
  });
  const handleSelectChatItem = (data: ChatItem) => {
    setSelectedChatItem((prev) => ({ ...prev, ...data }));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <ChatListSidebar handleSelectChatItem={handleSelectChatItem} />
      {selectedChatItem.chatId === -1 ? (
        <div>hello here is when we just get in chatUp</div>
      ) : (
        <ChatConversation selectedChatItem={selectedChatItem} />
      )}
    </div>
  );
};
export default ChatContainer;
