import { archiveConversation } from "@/app/_actions/conversationActions/archiveConversation";
import { removeConversation } from "@/app/_actions/conversationActions/removeConversation";
import { unArchiveConversation } from "@/app/_actions/conversationActions/unArchiveConversation";
import Avatar from "@/app/components/avatar/Avatar";
import Dialog from "@/app/components/dialog/Dialog";
import Menu from "@/app/components/menu/Menu";
import UnreadMessagesCounter from "@/app/components/unreadMessagesCounter/UnreadMessagesCounter";
import { chatItemActions } from "@/utils/constants/actionLists/chatItemActions";
import {
  ChatSessionType,
  MenuPosition,
  globals,
} from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookiesHelpers";
import { formatChatSessionDate } from "@/utils/helpers/dateHelpers";
import { getOtherUserId } from "@/utils/helpers/sharedHelpers";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, memo, useMemo, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdArchive, MdUnarchive } from "react-icons/md";
import GetLastMessagePreview from "../getLastMessagePreview/GetLastMessagePreview";
import { ConversationItemProps } from "./ConversationItem.types";

const ConversationItem: FC<ConversationItemProps> = (props) => {
  const { conversation } = props;
  const router = useRouter();
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleArchiveConversation = async () => {
    await archiveConversation({ conversationId: conversation.id });
  };

  const handleUnArchiveConversation = async () => {
    await unArchiveConversation({ conversationId: conversation.id });
  };
  const archiveAction = {
    label: conversation.archived ? "Unarchive" : "Archive",
    name: conversation.archived ? "Unarchive" : "Archive",
    icon: conversation.archived ? (
      <MdUnarchive size={22} />
    ) : (
      <MdArchive size={22} />
    ),
    onClick: conversation.archived
      ? handleUnArchiveConversation
      : handleArchiveConversation,
  };
  const onClickFunctions: { [key: string]: () => void } = {
    rename: () => console.log("edit"),
    remove: openModal,
  };
  const updatedChatItemActions = useMemo(() => {
    const actions = chatItemActions.map((action) => {
      if (action.label === "archive") {
        return {
          ...action,
          ...archiveAction,
        };
      }
      return {
        ...action,
        onClick: onClickFunctions[action.label],
      };
    });
    return actions;
  }, [chatItemActions, archiveAction]);

  const handleRemoveConversation = async () => {
    await removeConversation({ conversationId: conversation.id });
    closeModal();
    router.push("/conversations");
  };

  return (
    <>
      {isOpen && (
        <Dialog
          title="Remove Conversation"
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
          pathname: `/conversations/${conversation.id}`,
          ...(conversation.type === ChatSessionType.INDIVIDUAL
            ? {
                query: {
                  secondMemberId: getOtherUserId(
                    conversation.participantsData,
                    `${currentUserId}`
                  ),
                },
              }
            : {}),
        }}
        scroll={false}
        className={`flex items-center rounded-md gap-4 m-2 px-2 py-3 ${
          pathname === `/conversations/${conversation.id}`
            ? "bg-gray-800"
            : "bg-gray-900"
        } hover:bg-gray-800`}
      >
        <div className="flex-shrink-0">
          {conversation.type === ChatSessionType.GROUP ? (
            <div className="relative h-12 w-12">
              {typeof conversation.image === "string" ? (
                <Avatar
                  additionalClasses="h-12 w-12"
                  rounded="rounded-full"
                  fileName={conversation.image as string}
                />
              ) : conversation?.image?.length === 1 ? (
                [conversation.image[0], ""].map((image, index) => (
                  <Avatar
                    key={index}
                    additionalClasses={`h-8 w-8 absolute ${
                      index === 0 ? "top-0 left-4" : "-top-4 right-0"
                    }`}
                    rounded={`rounded-full ${
                      typeof image === "string" && image !== ""
                        ? ""
                        : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                    }`}
                    fileName={image}
                  />
                ))
              ) : (
                conversation?.image
                  ?.slice(0, 2)
                  .map((image, index) => (
                    <Avatar
                      key={index}
                      additionalClasses={`h-8 w-8 absolute ${
                        index === 0 ? "top-0 left-4" : "-top-4 right-0"
                      }`}
                      rounded={`rounded-full ${
                        typeof image === "string" && image !== ""
                          ? ""
                          : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                      }`}
                      fileName={image}
                    />
                  ))
              )}
            </div>
          ) : (
            <Avatar
              additionalClasses="h-12 w-12"
              rounded={`rounded-full ${
                typeof conversation.image === "string" &&
                conversation.image !== ""
                  ? ""
                  : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
              }`}
              fileName={conversation.image as string}
              userId={getOtherUserId(
                conversation.participantsData,
                `${currentUserId}`
              )}
            />
          )}
        </div>
        <div className="flex flex-col min-w-0 w-[calc(100%-4rem)]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gold-600 max-w-[calc(100%-3rem)] truncate">
              {conversation.title}
            </div>
            <div className="text-xs text-gold-400 ml-2 truncate">
              {formatChatSessionDate(conversation.lastMessage?.timestamp)}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <GetLastMessagePreview lastMessage={conversation.lastMessage} />
            <div className="flex items-center gap-2">
              <UnreadMessagesCounter
                conversation={conversation}
                currentUserId={currentUserId}
              />
              <Menu
                actionList={updatedChatItemActions}
                position={MenuPosition.TOP_RIGHT}
                icon={BiDotsVerticalRounded}
              />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
export default memo(ConversationItem);
