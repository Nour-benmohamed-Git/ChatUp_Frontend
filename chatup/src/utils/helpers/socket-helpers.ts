import { FriendRequestResponse } from "@/types/FriendRequest";
import { MessageResponse } from "@/types/Message";
import { Socket } from "socket.io-client";

export const handleJoinPrivateRoom = (
  socket: Socket,
  conversationId: number
): void => {
  socket.emit("join_private_room", conversationId);
};

export const emitMessage = async (
  socket: Socket,
  messageData: {
    action:
      | "create"
      | "edit"
      | "hardRemove"
      | "softRemove"
      | "markAsRead"
      | "react";
    message: Partial<MessageResponse>;
    reaction?: string;
  }
) => {
  socket?.emit("send_Message", messageData);
};

export const emitFriendRequest = (
  socket: Socket,
  friendRequestData: {
    action: "send" | "markAsSeen" | "accept" | "decline";
    friendRequest?: FriendRequestResponse;
  }
) => {
  socket?.emit("send_friend_request", friendRequestData);
};

export const emitForwardedMessage = (
  socket: Socket,
  forwardData: {
    forwardedMessages: MessageResponse[];
  }
) => {
  socket?.emit("forward_message", forwardData);
};
