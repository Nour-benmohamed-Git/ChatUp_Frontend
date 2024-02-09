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
    action: "create" | "remove" | "update";
    data: {
      content: string | number;
      senderId?: string | number;
      receiverId?: number;
      chatSessionId?: number;
    };
    room: number;
  }
) => {
  socket?.emit("sendMessage", messageData);
};
