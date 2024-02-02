import MessageField from "@/components/message-field/message-field";
import { useAddChatSessionMutation } from "@/redux/apis/chat-sessions/chatSessionsApi";
import { connectToSocket } from "@/utils/config/socket";
import { chatControlPanelActions } from "@/utils/constants/action-lists/chat-control-panel-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { z } from "zod";
import { ChatControlPanelProps } from "./chat-control-panel.types";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { globals } from "@/utils/constants/globals";

const schema = z.object({
  message: z.string().nonempty("message is required."),
});
const ChatControlPanel: FC<ChatControlPanelProps> = (props) => {
  const { selectedChatItem } = props;
  const [addChatSession] = useAddChatSessionMutation();
  const methods = useForm({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(schema),
  });

  const handleSendMessage = () => {
    const currentUserId = getItem(globals.currentUserId);
    if (!selectedChatItem?.chatId) {
      addChatSession({
        secondMemberId: selectedChatItem?.secondMemberId as number,
      });
    }
    if (!methods.watch("message")) {
      return;
    }
    const socket = connectToSocket();
    socket.emit("sendMessage", {
      data: {
        content: methods.watch("message"),
        senderId: currentUserId,
        chatSessionId: selectedChatItem?.chatId,
      },
      room: selectedChatItem?.chatId,
    });

    methods.setValue("message", "");
  };
  return (
    <FormProvider {...methods}>
      <div className="sticky bottom-0 bg-gray-900 shadow-lg h-16 z-40 px-4 py-2.5">
        <div className="flex items-center justify-center h-full gap-5">
          <div className="flex gap-7 h-full">
            {chatControlPanelActions.map((action) => (
              <button key={action.label}>
                <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-50">
                  {action.icon}
                </div>
              </button>
            ))}
          </div>
          <MessageField
            id="message"
            name="message"
            placeholder="Type your message"
          />

          {methods.watch("message") ? (
            <button onClick={handleSendMessage}>
              <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-50">
                <BsFillSendFill size={24} />
              </div>
            </button>
          ) : (
            <button>
              <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-50">
                <FaMicrophone size={24} />
              </div>
            </button>
          )}
        </div>
      </div>
    </FormProvider>
  );
};
export default ChatControlPanel;
