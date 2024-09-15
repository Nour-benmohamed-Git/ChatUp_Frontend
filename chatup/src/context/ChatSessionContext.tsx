"use client";
import { useSocket } from "@/context/SocketContext";
import { ConversationResponse } from "@/types/ChatSession";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ChatSessionContextProps {
  chatSessions: ConversationResponse[];
  setChatSessions: (sessions: ConversationResponse[]) => void;
}

const ChatSessionContext = createContext<ChatSessionContextProps | undefined>(
  undefined
);

export const useChatSessions = () => {
  const context = useContext(ChatSessionContext);
  if (!context) {
    throw new Error(
      "useChatSessions must be used within a ChatSessionProvider"
    );
  }
  return context;
};

export const ChatSessionProvider: FC<{
  children: ReactNode;
  initialChatSessions: ConversationResponse[];
}> = ({ children, initialChatSessions }) => {
  const [chatSessions, setChatSessions] =
    useState<ConversationResponse[]>(initialChatSessions);
  const { socket } = useSocket();

  useEffect(() => {
    const handleNotification = (chatSessionData: any) => {
      switch (chatSessionData.type) {
        case "updateChatListOnAddition":
          setChatSessions((prevChatSessions: any) => {
            const chatSessionIndex = prevChatSessions.findIndex(
              (chatSession: any) => chatSession.id === chatSessionData.data.id
            );
            if (chatSessionIndex !== -1) {
              return prevChatSessions.map((chatSession: any) => {
                if (chatSession.id === chatSessionData.data.id) {
                  return {
                    ...chatSession,
                    lastMessage: chatSessionData.data.lastMessage,
                    unreadMessagesCount: chatSessionData.unreadMessagesCount,
                  };
                }
                return chatSession;
              });
            } else {
              return [
                ...prevChatSessions,
                {
                  id: chatSessionData.data.id,
                  title: chatSessionData.data.title,
                  type: chatSessionData.data.type,
                  image: chatSessionData.data.image,
                  lastMessage: chatSessionData.data.lastMessage,
                  unreadMessagesCount: chatSessionData.unreadMessagesCount,
                  participantsData: chatSessionData.participantsData,
                },
              ];
            }
          });
          break;
        case "updateChatListOnMessageEdit":
          setChatSessions((prevChatSessions: any) => {
            return prevChatSessions?.map((chatSession: any) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  lastMessage: chatSessionData.data.lastMessage,
                };
              }
              return chatSession;
            });
          });
          break;
        case "markAsReadOnChatListUpdate":
          setChatSessions((prevChatSessions: any) => {
            return prevChatSessions?.map((chatSession: any) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  unreadMessagesCount: chatSessionData.unreadMessagesCount,
                };
              }
              return chatSession;
            });
          });
          break;
        case "updateChatListOnRemoval":
          setChatSessions((prevChatSessions: any) => {
            return prevChatSessions?.map((chatSession: any) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  lastMessage: chatSessionData.data.lastMessage,
                  unreadMessagesCount: chatSessionData.unreadMessagesCount,
                };
              }
              return chatSession;
            });
          });
          break;
       
        case "updateChatListOnReaction":
          setChatSessions((prevChatSessions: any) => {
            return prevChatSessions?.map((chatSession: any) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  lastMessage: chatSessionData.data.lastMessage,
                  unreadMessagesCount: chatSessionData.unreadMessagesCount,
                };
              }
              return chatSession;
            });
          });
          break;
        default:
          console.log("Unknown notification type:", chatSessionData.type);
      }
    };

    if (socket) {
      socket.on("notification", handleNotification);
    }

    return () => {
      socket?.off("notification", handleNotification);
    };
  }, [socket]);

  return (
    <ChatSessionContext.Provider
      value={{
        chatSessions,
        setChatSessions,
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};
