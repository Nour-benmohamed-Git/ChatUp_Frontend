import { removeConversation } from "@/app/_actions/conversation-actions/remove-conversation";
import { chatItemActions } from "@/utils/constants/action-lists/chat-item-actions";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { formatChatSessionDate } from "@/utils/helpers/dateHelpers";
import { getOtherUserId } from "@/utils/helpers/sharedHelpers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, memo, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Avatar from "../avatar/avatar";
import Dialog from "../dialog/dialog";
import Menu from "../menu/menu";
import { MenuPosition } from "../menu/menu.types";
import UnreadMessagesCounter from "../unread-messages/unread-messages-counter";
import { ConversationListItemProps } from "./conversation-list-item.types";

const ConversationListItem: FC<ConversationListItemProps> = (props) => {
  const { conversation } = props;
  const currentUserId = getItem(globals.currentUserId) as string;
  const pathname = usePathname();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
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
  const updatedChatItemActions = chatItemActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));
  const handleRemoveConversation = async () => {
    await removeConversation({ conversationId: conversation.id });
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
              onClick: handleRemoveConversation,
              category: "dismissal",
            },
          ]}
        >
          Are you sure you want to remove this chat session?
        </Dialog>
      )}
      <Link
        href={{
          pathname: `/conversation/${conversation.id}`,
          query: {
            deletedByCurrentUser: conversation.deletedByCurrentUser,
            secondMemberId: getOtherUserId(
              conversation.participantsData,
              currentUserId
            ),
          },
        }}
        scroll={false}
        className={`flex items-center rounded-md gap-4 m-2 px-2 py-3 ${
          pathname === `/conversation/${conversation.id}`
            ? "bg-gray-800"
            : "bg-gray-900"
        } hover:bg-gray-800`}
      >
        <Avatar additionalClasses="h-12 w-12" fileName={conversation.image} />
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gold-600 truncate">
              {conversation.title}
            </div>
            <div className="text-xs text-gold-400 ml-2">
              {formatChatSessionDate(conversation.lastMessage?.timestamp)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-white truncate">
              {conversation.lastMessage?.content}
            </div>
            <div className="flex items-center gap-2">
              <UnreadMessagesCounter
                conversation={conversation}
                currentUserId={parseInt(currentUserId, 10)}
              />
              <div
                ref={buttonRef}
                role="button"
                onClick={handleOpenMenu}
                className="flex justify-center items-center text-gold-900"
              >
                <BiDotsVerticalRounded size={20} />
              </div>
              <Menu
                actionList={updatedChatItemActions}
                isOpen={isOpenMenu}
                onClose={handleCloseMenu}
                buttonRef={buttonRef}
                position={MenuPosition.TOP_RIGHT}
              />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
export default memo(ConversationListItem);
