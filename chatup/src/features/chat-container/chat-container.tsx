"use client";
import { FC, useState } from "react";
import ChatConversation from "../chat-conversation/chat-conversation";
import ChatListSidebar from "../chat-list-sidebar/chat-list-sidebar";

const ChatContainer: FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number>(1);
  const handleSelectChatItem = (id: number) => {
    setSelectedChatId(id);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <ChatListSidebar onSelectChat={handleSelectChatItem} />
      <ChatConversation chatId={selectedChatId} />
    </div>
  );
};
export default ChatContainer;
