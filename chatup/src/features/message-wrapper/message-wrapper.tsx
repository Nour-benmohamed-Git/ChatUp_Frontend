import { fetchConversationMessages } from "@/app/_actions/fetch-conversation-messages";
import { updateConversation } from "@/app/_actions/update-conversation";
import Chip from "@/components/chip/Chip";
import { useSocket } from "@/context/socket-context";
import { Message } from "@/types/Message";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import dynamic from "next/dynamic";
import { FC, memo, useEffect, useRef, useState } from "react";
import { MessageWrapperProps } from "./message-wrapper.types";
const Message = dynamic(() => import("@/components/message/message"), {
  ssr: false,
});
const MessageWrapper: FC<MessageWrapperProps> = (props) => {
  const { conversationRelatedData, initialMessages } = props;
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages.length]);

  const getMessages = async (conversationId: string) => {
    const res = await fetchConversationMessages(conversationId);
    res && setMessages(res?.data);
  };

  useEffect(() => {
    if (conversationRelatedData?.conversationId) {
      getMessages(`${conversationRelatedData.conversationId}`);
      socket?.emit("joinPrivateRoom", conversationRelatedData?.conversationId);
    }
    return () => {
      socket?.off("joinPrivateRoom");
    };
  }, [socket, conversationRelatedData?.conversationId]);

  useEffect(() => {
    socket?.on("receiveMessage", (newMessage) => {
      if (
        conversationRelatedData?.conversationId &&
        conversationRelatedData?.deletedByCurrentUser
      ) {
        updateConversation(conversationRelatedData?.conversationId as number)
          .then(() => {
            switch (newMessage.action) {
              case "create":
                setMessages((prevMessages) => [
                  ...prevMessages,
                  newMessage.data,
                ]);
                break;
              case "markAsRead":
                setMessages((prevMessages) =>
                  prevMessages.map((message) => {
                    if (newMessage.messageIds.includes(message.id)) {
                      return { ...message, readStatus: true };
                    }
                    return message;
                  })
                );
              case "hardRemove":
                setMessages((prevMessages) =>
                  prevMessages.filter((item) => item.id !== newMessage.data.id)
                );
                break;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        switch (newMessage.action) {
          case "create":
            setMessages((prevMessages) => [...prevMessages, newMessage.data]);
            break;
          case "markAsRead":
            setMessages((prevMessages) =>
              prevMessages.map((message) => {
                if (newMessage.messageIds?.includes(message.id)) {
                  return { ...message, readStatus: true };
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
        }
      }
    });
  }, [socket, conversationRelatedData]);
  useEffect(() => {
    currentUserId &&
      socket &&
      emitMessage(socket, {
        action: "markAsRead",
        message: {
          senderId: conversationRelatedData?.secondMemberId as number,
          receiverId: currentUserId,
          chatSessionId: conversationRelatedData.conversationId as number,
        },
      });
  }, []);

  let content = null;
  if (!conversationRelatedData?.conversationId || !messages.length) {
    content = (
      <div className="flex flex-col min-h-full items-center justify-end py-2">
        <Chip content="Today" />
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col min-h-full justify-end px-2 md:px-16 py-2">
        {messages?.map((message) => (
          <Message
            key={message.id}
            message={message}
            conversationRelatedData={conversationRelatedData}
          />
        ))}
      </div>
    );
  }

  return (
    <div ref={messageListRef} className="overflow-y-auto h-full">
      {content}
    </div>
  );
};
export default memo(MessageWrapper);
