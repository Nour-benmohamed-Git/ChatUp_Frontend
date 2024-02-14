import { useDeleteChatSessionMutation } from "@/redux/apis/chat-sessions/chatSessionsApi";
import { ChatItemActions } from "@/utils/constants/action-lists/chat-item-actions";
import { formatChatSessionDate } from "@/utils/helpers/dateHelpers";
import {
  getChatSessionTitle,
  getOtherUserId,
} from "@/utils/helpers/sharedHelpers";
import { FC, memo, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Avatar from "../avatar/avatar";
import Dialog from "../dialog/dialog";
import Menu from "../menu/menu";
import UnreadMessagesCounter from "../unread-messages/unread-messages-counter";
import { ConversationListItemProps } from "./conversation-list-item.types";
import { MenuPosition } from "../menu/menu.types";

const ConversationListItem: FC<ConversationListItemProps> = (props) => {
  const { handleSelectChatItem, chatSession } = props;
  const buttonRef = useRef<HTMLDivElement>(null);
  const [removeChatSession] = useDeleteChatSessionMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const handleOpenMenu = () => {
    setIsOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setIsOpenMenu(false);
  };
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
  const handleRemoveChatSession = () => {
    removeChatSession({ id: chatSession.id });
    handleSelectChatItem({ chatId: -1 });
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
              onClick: handleRemoveChatSession,
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
        <Avatar additionalClasses="h-12 w-12" fileName={chatSession.image} />
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
            <div className="flex items-center gap-2 h-8">
              <UnreadMessagesCounter chatSession={chatSession} />
              <div
                ref={buttonRef}
                role="button"
                onClick={handleOpenMenu}
                className="flex justify-center items-center rounded-full h-8 w-8 bg-slate-900 text-gold-900"
              >
                <BiDotsVerticalRounded size={20} />
              </div>
              <Menu
                actionList={updatedMessageActions}
                isOpen={isOpenMenu}
                onClose={handleCloseMenu}
                buttonRef={buttonRef}
                position={MenuPosition.TOP_RIGHT}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(ConversationListItem);
