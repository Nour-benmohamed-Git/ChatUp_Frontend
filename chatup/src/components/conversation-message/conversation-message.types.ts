import { MessageResponse } from "@/types/Message";
import { Socket } from "socket.io-client";

export interface ConversationMessageProps {
  message: MessageResponse;
  socket: Socket;
}
