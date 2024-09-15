"use client";
import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import { useSocket } from "@/context/SocketContext";
import { ConversationResponse } from "@/types/ChatSession";
import { MessageResponse } from "@/types/Message";
import { Direction } from "@/utils/constants/globals";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface MessageContextProps {
  messages: MessageResponse[];
  addMessage: (
    message: MessageResponse,
    conversation?: ConversationResponse
  ) => void;
  updateMessage: (message: MessageResponse) => void;
  hardRemoveMessage: (message: MessageResponse) => void;
  softRemoveMessage: (message: MessageResponse) => void;
  reactMessage: (message: MessageResponse, reaction?: string) => void;
  setMessages: (messages: MessageResponse[]) => void;
  paginator: {
    limit: number;
    total: number;
    cursor: {
      earliest?: number;
      latest?: number;
    };
    direction: Direction;
    hasMoreBefore: boolean;
    hasMoreAfter: boolean;
  };
  setPaginator: Dispatch<
    SetStateAction<{
      limit: number;
      total: number;
      cursor: {
        earliest?: number;
        latest?: number;
      };
      direction: Direction;
      hasMoreBefore: boolean;
      hasMoreAfter: boolean;
    }>
  >;
  messageListRef: React.RefObject<HTMLDivElement>;
}

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};

export const MessageProvider: FC<{
  children: ReactNode;
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
}> = ({ children, conversationRelatedData }) => {
  const { socket } = useSocket();
  const messageListRef = useRef<HTMLDivElement>(null);
  const isNewMessageAdded = useRef<boolean>(false);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [paginator, setPaginator] = useState<{
    limit: number;
    total: number;
    cursor: { earliest?: number; latest?: number };
    direction: Direction;
    hasMoreBefore: boolean;
    hasMoreAfter: boolean;
  }>({
    limit: 30,
    total: 0,
    cursor: {},
    direction: Direction.FORWARD,
    hasMoreBefore: false,
    hasMoreAfter: false,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetchConversationMessages(
          conversationRelatedData?.conversationId as string
        );
        if (response.data) {
          setMessages(response.data.data);
          setPaginator({
            limit: 30,
            total: response.data.total,
            cursor: response.data.newCursor,
            direction: Direction.FORWARD,
            hasMoreBefore: response.data.hasMoreBefore,
            hasMoreAfter: response.data.hasMoreAfter,
          });
        } else {
          console.warn("No data returned from fetchConversationMessages");
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [conversationRelatedData?.conversationId]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    if (isNewMessageAdded.current) {
      scrollToBottom();
      isNewMessageAdded.current = false;
    }
  }, [messages]);
  const addMessage = async (messageToAdd: MessageResponse) => {
    if (socket) {
      await emitMessage(socket, { action: "create", message: messageToAdd });
      isNewMessageAdded.current = true;
    }
  };

  const updateMessage = (updatedMessage: MessageResponse) => {
    socket && emitMessage(socket, { action: "edit", message: updatedMessage });
  };

  const hardRemoveMessage = (messageToRemove: MessageResponse) => {
    socket &&
      emitMessage(socket, { action: "hardRemove", message: messageToRemove });
  };

  const softRemoveMessage = (messageToRemove: MessageResponse) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageToRemove.id)
    );
    socket &&
      emitMessage(socket, { action: "softRemove", message: messageToRemove });
  };

  const reactMessage = (messageToReact: MessageResponse, reaction?: string) => {
    socket &&
      emitMessage(socket, {
        action: "react",
        message: messageToReact,
        reaction: reaction,
      });
  };

  const markMessagesAsRead = () => {
    socket &&
      emitMessage(socket, {
        action: "markAsRead",
        message: {
          senderId: parseInt(
            conversationRelatedData?.currentUserId as string,
            10
          ),
          chatSessionId: conversationRelatedData?.conversationId as number,
        },
      });
  };

  useEffect(() => {
    if (socket && conversationRelatedData?.conversationId) {
      const handleJoinRoom = () => {
        socket.emit(
          "join_private_room",
          conversationRelatedData.conversationId
        );
      };
      handleJoinRoom();
      socket.io.on("reconnect", handleJoinRoom);

      return () => {
        socket.emit(
          "leave_private_room",
          conversationRelatedData.conversationId
        );
        socket.io.off("reconnect", handleJoinRoom);
      };
    }
  }, [socket, conversationRelatedData?.conversationId]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage: any) => {
      switch (newMessage.action) {
        case "create":
          setMessages((prevMessages) => {
            // Remove participants from previous messages' readBy arrays
            const updatedMessages = prevMessages.map((message) => {
              if (newMessage.data.readBy.length > 0) {
                return {
                  ...message,
                  // Filter out participants who are in the new message's readBy list
                  readBy: message?.readBy?.filter(
                    (participant: any) =>
                      !newMessage.data.readBy.some(
                        (newParticipant: any) =>
                          participant.id === newParticipant.id
                      ) &&
                      participant.id !==
                        parseInt(
                          conversationRelatedData?.currentUserId as string,
                          10
                        )
                  ),
                };
              }
              return message;
            });

            // Add the new message to the top, excluding the current user's avatar from readBy
            return [
              {
                ...newMessage.data,
                readBy: newMessage.data.readBy.filter(
                  (participant: any) =>
                    participant.id !==
                    parseInt(
                      conversationRelatedData?.currentUserId as string,
                      10
                    )
                ),
              },
              ...updatedMessages,
            ];
          });
          break;
        case "edit":
          setMessages((prevMessages) =>
            prevMessages.map((message) => {
              if (message.id === newMessage.data.id) {
                return { ...message, ...newMessage.data };
              }
              return message;
            })
          );
          break;
        case "hardRemove":
          setMessages((prevMessages) =>
            prevMessages.filter((item) => item.id !== newMessage.data.id)
          );
          break;
        case "react":
          setMessages((prevMessages) =>
            prevMessages.map((message) => {
              if (message.id === newMessage.data.id) {
                return { ...message, reactions: newMessage.data.reactions };
              }
              return message;
            })
          );
          break;
        case "markAsRead":
          setMessages((prevMessages) =>
            prevMessages.map((message) => {
              return {
                ...message,
                readBy: newMessage.lastSeenMessages[message.id]
                  ? newMessage.lastSeenMessages[message.id].filter(
                      (participant: any) =>
                        participant.id !==
                        parseInt(
                          conversationRelatedData?.currentUserId as string,
                          10
                        )
                    )
                  : [],
              };
            })
          );
          break;
      }
    };
    socket?.on("receive_Message", handleReceiveMessage);
    return () => {
      socket?.off("receive_Message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (socket && !conversationRelatedData.seen) {
      markMessagesAsRead();
    }
  }, [socket, conversationRelatedData.seen]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessage,
        updateMessage,
        hardRemoveMessage,
        softRemoveMessage,
        reactMessage,
        setMessages,
        paginator,
        setPaginator,
        messageListRef,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
