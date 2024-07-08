import { FriendRequestResponse } from "@/types/FriendRequest";
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
    action: "create" | "edit" | "hardRemove" | "markAsRead";
    message: Message;
  }
) => {
  socket?.emit("sendMessage", messageData);
};

export const emitFriendRequest = (
  socket: Socket,
  friendRequestData: {
    action: "send" | "markAsSeen" | "accept" | "decline";
    friendRequest?: FriendRequestResponse;
  }
) => {
  socket?.emit("send-friend-request", friendRequestData);
};
