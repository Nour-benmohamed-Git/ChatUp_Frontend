import { FC, memo } from "react";
import Avatar from "../avatar/avatar";
import { ConversationListItemProps } from "./conversation-list-item.types";
import { getChatSessionTitle } from "@/utils/helpers/sharedHelpers";
import { formatChatSessionDate } from "@/utils/helpers/dateHelpers";

const ConversationListItem: FC<ConversationListItemProps> = (props) => {
  const { handleSelectChatItem, chatSession, currentUserId } = props;
  return (
    <div
      role="button"
      className="flex items-center rounded-md gap-4 m-2 px-2 py-3 bg-gray-900 hover:bg-gray-800"
      onClick={() => handleSelectChatItem({ chatId: chatSession.id })}
    >
      <Avatar additionalClasses="h-12 w-12" />
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gold-600 truncate">
            {getChatSessionTitle(chatSession.participantsData, currentUserId)}
          </div>
          <div className="text-xs text-gold-400 ml-2">
            {formatChatSessionDate(chatSession.lastMessage?.timestamp)}
          </div>
        </div>
        <div className="text-xs text-white truncate">
          {chatSession.lastMessage?.content}
        </div>
      </div>
    </div>
  );
};
export default memo(ConversationListItem);
