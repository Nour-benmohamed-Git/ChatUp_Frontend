import MessageField from "@/components/message-field/message-field";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import {
  useAddChatSessionMutation,
  useUpdateChatSessionMutation,
} from "@/redux/apis/chat-sessions/chatSessionsApi";
import { chatControlPanelActions } from "@/utils/constants/action-lists/chat-control-panel-actions";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { z } from "zod";
import { ChatControlPanelProps } from "./chat-control-panel.types";

const schema = z.object({
  message: z.string().min(1, "message is required."),
});
const ChatControlPanel: FC<ChatControlPanelProps> = (props) => {
  const { selectedChatItem, handleSelectChatItem, socket } = props;

  const [addChatSession] = useAddChatSessionMutation();
  const [updateChatSession] = useUpdateChatSessionMutation();
  const methods = useForm({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(schema),
  });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, methods.watch("message"));
  const handleSendMessage = () => {
    if (!methods.watch("message")) {
      return;
    }
    const currentUserId = getItem(globals.currentUserId);
    if (!selectedChatItem?.chatId) {
      addChatSession({
        secondMemberId: selectedChatItem?.secondMemberId as number,
      })
        .unwrap()
        .then((res) => {
          handleSelectChatItem && handleSelectChatItem({ chatId: res.data.id });
          socket &&
            currentUserId &&
            emitMessage(socket, {
              action: "create",
              data: {
                content: methods.watch("message"),
                senderId: +currentUserId,
                receiverId: selectedChatItem?.secondMemberId,
                chatSessionId: res.data.id,
              },
              room: res.data.id,
            });
          methods.setValue("message", "");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (selectedChatItem?.deletedByCurrentUser === true) {
        updateChatSession({
          id: selectedChatItem?.chatId,
        })
          .unwrap()
          .then((res) => {
            handleSelectChatItem &&
              handleSelectChatItem({ chatId: res.data.id });
            socket &&
              currentUserId &&
              emitMessage(socket, {
                action: "create",
                data: {
                  content: methods.watch("message"),
                  senderId: +currentUserId,
                  receiverId: selectedChatItem?.secondMemberId,
                  chatSessionId: res.data.id,
                },
                room: res.data.id,
              });
            methods.setValue("message", "");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        socket &&
          currentUserId &&
          emitMessage(socket, {
            action: "create",
            data: {
              content: methods.watch("message"),
              senderId: +currentUserId,
              receiverId: selectedChatItem?.secondMemberId,
              chatSessionId: selectedChatItem?.chatId as number,
            },
            room: selectedChatItem?.chatId as number,
          });
        methods.setValue("message", "");
      }
    }
  };
  return (
    <FormProvider {...methods}>
      <div className="flex items-center sticky bottom-0 bg-gray-900 shadow-lg min-h-16 max-h-40 z-40 px-4 py-2.5">
        <div className="flex items-center justify-center h-full w-full gap-5">
          <div className="flex gap-7 h-full">
            {chatControlPanelActions.map((action) => (
              <button key={action.label}>
                <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
                  {action.icon}
                </div>
              </button>
            ))}
          </div>
          <MessageField
            id="message"
            name="message"
            placeholder="Type your message"
            messageFieldRef={textAreaRef}
          />

          {methods.watch("message") ? (
            <button onClick={handleSendMessage}>
              <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
                <BsFillSendFill size={24} />
              </div>
            </button>
          ) : (
            <button>
              <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
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
