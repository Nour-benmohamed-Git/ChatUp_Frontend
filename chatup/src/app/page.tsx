"use client";
import ChatConversation from "@/features/chat-conversation/chat-conversation";
import ChatListSidebar from "@/features/chat-list-sidebar/chat-list-sidebar";
import { useState } from "react";

export default function Home() {
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
}
