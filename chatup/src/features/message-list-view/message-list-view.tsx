import ConversationMessage from "@/components/conversation-message/conversation-message";
import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import {
  chatSessionsApi,
  useGetMessageByChatSessionIdQuery,
  useUpdateChatSessionMutation,
} from "@/redux/apis/chat-sessions/chatSessionsApi";
import { MessageResponse } from "@/types/Message";
import { FC, memo, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { MessageListViewProps } from "./message-list-view.types";

const MessageListView: FC<MessageListViewProps> = (props) => {
  const { selectedChatItem, handleSelectChatItem, socket } = props;
  const [updateChatSession] = useUpdateChatSessionMutation();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetMessageByChatSessionIdQuery(
    selectedChatItem.chatId
  );
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const messageListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);
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
              case "remove":
                setMessages((prevMessages) =>
                  prevMessages.filter((item) => item.id !== newMessage.data.id)
                );
                dispatch(
                  chatSessionsApi.util.invalidateTags([
                    { type: "ChatSessions", id: res.data.id },
                  ])
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
          case "remove":
            setMessages((prevMessages) =>
              prevMessages.filter((item) => item.id !== newMessage.data.id)
            );
            break;
          default:
        }
      }
    });

    return () => {
      socket.off("joinPrivateRoom");
    };
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
      <div className="flex flex-col min-h-full justify-end px-0 md:px-16">
        {messages?.map((message) => (
          <ConversationMessage
            key={message.id}
            message={message}
            socket={socket}
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
