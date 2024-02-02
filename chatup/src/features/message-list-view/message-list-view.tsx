import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import { useGetMessageByChatSessionIdQuery } from "@/redux/apis/message/messageApi";
import { MessageResponse } from "@/types/Message";
import { connectToSocket } from "@/utils/config/socket";
import { FC, memo, useEffect, useState } from "react";
import { MessageListViewProps } from "./message-list-view.types";
import ConversationMessage from "@/components/conversation-message/conversation-message";

const MessageListView: FC<MessageListViewProps> = (props) => {
  const { selectedChatItem } = props;
  const { data, isLoading, error } = useGetMessageByChatSessionIdQuery(
    selectedChatItem.chatId
  );
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  useEffect(() => {
    if (!selectedChatItem.chatId) {
      // No need to establish connection if there's no chatId
      return;
    }

    if (data?.data) {
      setMessages(data.data);
    }
    const socket = connectToSocket();
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socket.emit("joinPrivateRoom", selectedChatItem.chatId);
    });
    socket.on("receiveMessage", (newMessage) => {
      console.log("hala walla", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChatItem.chatId, data]);

  let content = null;
  if (isLoading) {
    content = <Loader />;
  }
  if (error) {
    content = <ErrorBox error={error} />;
  }

  return (
    <div className="h-full">
      {selectedChatItem.chatId === 0 ? (
        <div>Today</div>
      ) : (
        <div className="flex flex-col min-h-full justify-end px-0 md:px-16">
          {messages?.map((message) => (
            <ConversationMessage key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
};
export default memo(MessageListView);
