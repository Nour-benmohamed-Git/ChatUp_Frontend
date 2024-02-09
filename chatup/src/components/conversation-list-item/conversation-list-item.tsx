import { useDeleteChatSessionMutation } from "@/redux/apis/chat-sessions/chatSessionsApi";
import { ChatItemActions } from "@/utils/constants/action-lists/chat-item-actions";
import { formatChatSessionDate } from "@/utils/helpers/dateHelpers";
import {
  getChatSessionTitle,
  getOtherUserId,
} from "@/utils/helpers/sharedHelpers";
import { FC, memo, useState } from "react";
import Avatar from "../avatar/avatar";
import Dialog from "../dialog/dialog";
import Popover from "../popover/popover";
import { PopoverPosition } from "../popover/popover.types";
import { ConversationListItemProps } from "./conversation-list-item.types";

const ConversationListItem: FC<ConversationListItemProps> = (props) => {
  const { handleSelectChatItem, chatSession } = props;
  const [removeChatSession, { data }] = useDeleteChatSessionMutation();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const onClickFunctions: { [key: string]: () => void } = {
    rename: () => console.log("edit"),
    remove: openModal,
  };
  const updatedMessageActions = ChatItemActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  const handleRemoveMessage = () => {
    removeChatSession({ id: chatSession.id });
    closeModal();
  };
  return (
    <>
      {isOpen && (
        <Dialog
          title="Remove message"
          onClose={closeModal}
          actions={[
            {
              label: "remove",
              onClick: handleRemoveMessage,
              category: "dismissal",
            },
          ]}
        >
          Are you sure you want to remove this chat session?
        </Dialog>
      )}
      <div
        role="button"
        className="flex items-center rounded-md gap-4 m-2 px-2 py-3 bg-gray-900 hover:bg-gray-800"
        onClick={() =>
          handleSelectChatItem({
            chatId: chatSession.id,
            secondMemberId: getOtherUserId(
              chatSession.participantsData
            ) as number,
          })
        }
      >
        <Avatar additionalClasses="h-12 w-12" />
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gold-600 truncate">
              {getChatSessionTitle(chatSession.participantsData)}
            </div>
            <div className="text-xs text-gold-400 ml-2">
              {formatChatSessionDate(chatSession.lastMessage?.timestamp)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-white truncate">
              {chatSession.lastMessage?.content}
            </div>
            <div className="flex items-center gap-2">
              {chatSession.count ? (
                <span className="flex items-center justify-center rounded-full bg-green-50 h-7 w-7 text-xs font-medium text-green-700 border-2 border-green-600/20">
                  {chatSession.count}
                </span>
              ) : null}
              <Popover
                actionList={updatedMessageActions}
                position={PopoverPosition.BOTTOM_LEFT}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(ConversationListItem);
