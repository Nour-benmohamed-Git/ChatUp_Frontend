import { FC, memo } from "react";
import { MessageListViewProps } from "./message-list-view.types";
import { useGetMessageByChatSessionIdQuery } from "@/redux/apis/message/messageApi";
import Loader from "@/components/loader/loader";
import ErrorBox from "@/components/error-box/error-box";

const MessageListView: FC<MessageListViewProps> = (props) => {
  const { chatId } = props;
  const { data, isLoading, error } = useGetMessageByChatSessionIdQuery(chatId);
  let content = null;
  if (isLoading) {
    content = <Loader />;
  }
  if (error) {
    content = <ErrorBox error={error} />;
  }
  console.log("data", data);
  return (
    <div className="overflow-y-auto h-full">
      {data?.data?.map?.((message) => (
        <div key={message.id} className="flex justify-start mb-4">
          {/* You can customize the message display here */}
          <div className="bg-gray-200 rounded-lg p-2">
            <p className="text-gray-800">{message.content}</p>
            <p className="text-gray-500 text-sm">{message.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default memo(MessageListView);
