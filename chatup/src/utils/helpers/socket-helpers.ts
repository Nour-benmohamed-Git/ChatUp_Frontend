import { Message } from "@/types/Message";
import { Socket } from "socket.io-client";

export const handleJoinPrivateRoom = (
  socket: Socket,
  conversationId: number
): void => {
  socket.emit("joinPrivateRoom", conversationId);
};

export const handleJoinGroupRoom = (socket: Socket, groupId: number): void => {
  socket.emit("joinGroupRoom", groupId);
};

export const emitMessage = (
  socket: Socket,
  messageData: {
    action: "create" | "hardRemove" | "markAsRead";
    message: Message;
    participantsData?: { [userId: string]: string };
  }
) => {
  const { participantsData, ...rest } = messageData;
  if (participantsData) {
    socket?.emit("sendMessage", messageData);
  } else {
    socket?.emit("sendMessage", rest);
  }
};
