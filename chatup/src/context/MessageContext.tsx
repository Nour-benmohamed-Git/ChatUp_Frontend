"use client";
import { useSocket } from "@/context/SocketContext";
import { ConversationResponse } from "@/types/ChatSession";
import { Message } from "@/types/Message";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface MessageContextProps {
  messages: Message[];
  addMessage: (message: Message, conversation?: ConversationResponse) => void;
  updateMessage: (message: Message) => void;
  hardRemoveMessage: (message: Message) => void;
  reactMessage: (message: Message, reaction?: string) => void;
  setMessages: (messages: Message[]) => void;
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
  initialMessages: Message[];
}> = ({ children, conversationRelatedData, initialMessages }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const { socket } = useSocket();
  const messageListRef = useRef<HTMLDivElement>(null);
  const isNewMessageAdded = useRef<boolean>(false);

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
  const addMessage = async (messageToAdd: Message) => {
    socket &&
      (await emitMessage(socket, { action: "create", message: messageToAdd }));
    isNewMessageAdded.current = true;
  };

  const updateMessage = (updatedMessage: Message) => {
    socket && emitMessage(socket, { action: "edit", message: updatedMessage });
  };

  const hardRemoveMessage = (messageToRemove: Message) => {
    socket &&
      emitMessage(socket, { action: "hardRemove", message: messageToRemove });
  };

  const reactMessage = (messageToReact: Message, reaction?: string) => {
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
      // console.log("newMessage", newMessage.lastSeenMessages);
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
    console.log(conversationRelatedData.seen);
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
        reactMessage,
        setMessages,
        messageListRef,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
