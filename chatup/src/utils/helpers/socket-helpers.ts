import { Socket } from "socket.io-client";

export const handleJoinPrivateRoom = (
  socket: Socket,
  chatSessionId: number
): void => {
  socket.emit("joinPrivateRoom", chatSessionId);
};

export const handleJoinGroupRoom = (socket: Socket, groupId: number): void => {
  socket.emit("joinGroupRoom", groupId);
};

export const emitMessage = (
  socket: Socket,
  messageData: {
    action: "create" | "remove" | "markAsRead";
    data: {
      id?: number;
      content?: string | number;
      senderId?: number;
      receiverId?: number;
      chatSessionId?: number;
    };
    room: number;
    messagesIds?: number[];
  }
) => {
  socket?.emit("sendMessage", messageData);
};
