import { sideBarActions } from "@/utils/constants/sidebar-actions";
import { FC, memo } from "react";
import BlocContainer from "../bloc-container/bloc-container";
import ConversationListItem from "@/components/conversation-list-item/conversation-list-item";
import { ChatListSidebarProps } from "./chat-list-sidebar.types";

const ChatListSidebar: FC<ChatListSidebarProps> = (props) => {
  const { onSelectChat } = props;
  return (
    <aside
      id="sidebar"
      className="col-span-1 h-screen md:border-r md:border-slate-500"
    >
      <BlocContainer
        actions={sideBarActions}
        hasSearchField
        height="calc(100% - 7.5rem)"
      >
        <ConversationListItem onSelectChat={onSelectChat}/>
      </BlocContainer>
    </aside>
  );
};
export default memo(ChatListSidebar);
