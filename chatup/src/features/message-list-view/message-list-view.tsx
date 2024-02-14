import Message from "@/components/message/message";
import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import {
  useGetMessagesByChatSessionIdQuery,
  useUpdateChatSessionMutation,
} from "@/redux/apis/chat-sessions/chatSessionsApi";
import { MessageResponse } from "@/types/Message";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { FC, memo, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MessageListViewProps } from "./message-list-view.types";

const MessageListView: FC<MessageListViewProps> = (props) => {
  const { selectedChatItem, handleSelectChatItem, socket } = props;
  const [updateChatSession] = useUpdateChatSessionMutation();
  const { data, isLoading, error } = useGetMessagesByChatSessionIdQuery(
    selectedChatItem.chatId
  );
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const messageListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages.length]);
  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
  }, [data]);
  useEffect(() => {
    if (!selectedChatItem.chatId) {
      return;
    }
    socket.emit("joinPrivateRoom", selectedChatItem.chatId);
    socket.on("receiveMessage", (newMessage) => {
      if (selectedChatItem?.deletedByCurrentUser === true) {
        updateChatSession({
          id: selectedChatItem?.chatId,
        })
          .unwrap()
          .then((res) => {
            handleSelectChatItem &&
              handleSelectChatItem({ chatId: res.data.id });
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
              case "remove":
                setMessages((prevMessages) =>
                  prevMessages.filter((item) => item.id !== newMessage.data.id)
                );
                toast.success("Message has been successfully removed.");
                break;
              default:
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
          case "remove":
            setMessages((prevMessages) =>
              prevMessages.filter((item) => item.id !== newMessage.data.id)
            );
            break;
          default:
        }
      }
    });
  }, []);
  useEffect(() => {
    const currentUserId = getItem(globals.currentUserId);
    currentUserId &&
      emitMessage(socket, {
        action: "markAsRead",
        data: {
          senderId: selectedChatItem?.secondMemberId,
          receiverId: +currentUserId,
          chatSessionId: selectedChatItem.chatId,
        },
        room: selectedChatItem.chatId,
        // messagesIds: messages
        //   .filter((msg) => !msg.readStatus)
        //   .map((el) => el.id),
      });
  }, []);

  let content = null;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <ErrorBox error={error} />;
  } else if (selectedChatItem.chatId === 0) {
    content = <div>Today</div>;
  } else {
    content = (
      <div className="flex flex-col min-h-full justify-end px-0 md:px-16 py-2">
        {messages?.map((message) => (
          <Message
            key={message.id}
            message={message}
            socket={socket}
            selectedChatItem={selectedChatItem}
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
export default memo(MessageListView);
