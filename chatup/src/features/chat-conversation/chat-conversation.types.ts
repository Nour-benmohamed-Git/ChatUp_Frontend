import { ChatItem } from "@/types/ChatItem";
import { Socket } from "socket.io-client";

export interface ChatConversationProps {
  selectedChatItem: ChatItem;
  handleSelectChatItem: (data: ChatItem) => void
  socket: Socket;
}
