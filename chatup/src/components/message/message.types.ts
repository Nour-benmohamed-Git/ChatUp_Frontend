import { ChatItem } from "@/types/ChatItem";
import { MessageResponse } from "@/types/Message";
import { Socket } from "socket.io-client";

export interface MessageProps {
  message: MessageResponse;
  socket: Socket;
  selectedChatItem: ChatItem;
}
