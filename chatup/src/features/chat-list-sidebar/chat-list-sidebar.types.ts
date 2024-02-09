import { ChatItem } from "@/types/ChatItem";
import { Socket } from "socket.io-client";

export interface ChatListSidebarProps {
  handleSelectChatItem: (data: ChatItem) => void;
  socket: Socket;
}
