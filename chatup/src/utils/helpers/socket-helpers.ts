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
