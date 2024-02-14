"use client";
import { ChatItem } from "@/types/ChatItem";
import { FC, useEffect, useState } from "react";
import ChatConversation from "../chat-conversation/chat-conversation";
import ChatListSidebar from "../chat-list-sidebar/chat-list-sidebar";
import useSocket from "@/hooks/use-socket";
import LandingPage from "../landing-page/landing-page";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { globals } from "@/utils/constants/globals";
import { connectToSocket, socket } from "@/utils/config/socket";

const ChatContainer: FC = () => {
  const token = getItem(globals.tokenKey);
  const [selectedChatItem, setSelectedChatItem] = useState<ChatItem>({
    chatId: -1,
    secondMemberId: 0,
    deletedByCurrentUser: false,
  });
  const handleSelectChatItem = (data: ChatItem) => {
    setSelectedChatItem((prev) => ({ ...prev, ...data }));
  };
  const socket = useSocket();
  console.log(socket?.connected);
  // useEffect(() => {
  //   if (!socket && token) {
  //     connectToSocket(token);
  //   }
  // }, [socket]);
  // console.log(socket);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <ChatListSidebar
        handleSelectChatItem={handleSelectChatItem}
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
  );
};
export default ChatContainer;
