"use client";
import useSocket from "@/hooks/use-socket";
import { ChatItem } from "@/types/ChatItem";
import { FC, useState } from "react";
import ChatConversation from "../chat-conversation/chat-conversation";
import ChatListSidebar from "../chat-list-sidebar/chat-list-sidebar";
import LandingPage from "../landing-page/landing-page";

const ChatContainer: FC = () => {
  const [selectedChatItem, setSelectedChatItem] = useState<ChatItem>({
    chatId: -1,
    secondMemberId: 0,
    deletedByCurrentUser: false,
  });
  const handleSelectChatItem = (data: ChatItem) => {
    setSelectedChatItem((prev) => ({ ...prev, ...data }));
  };
  const socket = useSocket();

  return (
    socket && (
      <div className="grid grid-cols-1 md:grid-cols-3">
        <ChatListSidebar
          handleSelectChatItem={handleSelectChatItem}
          selectedChatItem={selectedChatItem}
          socket={socket}
        />
        {selectedChatItem.chatId === -1 ? (
          <LandingPage />
        ) : (
          <ChatConversation
            selectedChatItem={selectedChatItem}
            handleSelectChatItem={handleSelectChatItem}
            socket={socket}
          />
        )}
      </div>
    )
  );
};
export default ChatContainer;
