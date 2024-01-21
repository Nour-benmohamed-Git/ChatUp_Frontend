import { FC, memo } from "react";
import Avatar from "../avatar/avatar";
import { ConversationListItemProps } from "./conversation-list-item.types";

const ConversationListItem: FC<ConversationListItemProps> = (props) => {
  const { onSelectChat } = props;
  return (
    <div
      className="flex items-center rounded-md gap-4 m-2 px-2 py-3 bg-gray-900 hover:bg-gray-800"
      onClick={onSelectChat as any}
    >
      <Avatar sizeClass="h-12 w-12" />
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gold-600 truncate">
            Nour elhak benmohamed
          </div>
          <div className="text-xs text-gold-400 ml-2">17/11/1992</div>
        </div>
        <div className="text-xs text-white truncate">
          Hello world! I am ready to finish my tasks no matter.Are you ready
          too?
        </div>
      </div>
    </div>
  );
};
export default memo(ConversationListItem);
