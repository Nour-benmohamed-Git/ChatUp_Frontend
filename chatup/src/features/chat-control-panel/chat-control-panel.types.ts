import { ChatItem } from "@/types/ChatItem";
import { Socket } from "socket.io-client";

export interface ChatControlPanelProps {
  selectedChatItem?: ChatItem;
  handleSelectChatItem?: (data: ChatItem) => void;
  socket?: Socket;
}
