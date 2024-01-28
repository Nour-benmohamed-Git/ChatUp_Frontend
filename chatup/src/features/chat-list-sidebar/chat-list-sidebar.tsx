import ConversationListItem from "@/components/conversation-list-item/conversation-list-item";
import SlidingPanel from "@/components/sliding-panel/sliding-panel";
import { SlidingPanelProps } from "@/components/sliding-panel/sliding-panel.types";
import usePanel from "@/hooks/use-panel";
import { sideBarActions } from "@/utils/constants/sidebar-actions";
import { FC, memo } from "react";
import BlocContainer from "../bloc-container/bloc-container";
import ConversationLauncher from "../conversation-launcher/conversation-launcher";
import MultiConversationLauncher from "../multi-conversation-launcher/multi-conversation-launcher";
import { ChatListSidebarProps } from "./chat-list-sidebar.types";
import Profile from "../profile/profile";

const ChatListSidebar: FC<ChatListSidebarProps> = (props) => {
  const { onSelectChat } = props;

  const {
    isOpen: isOpenNewChatPanel,
    togglePanel: toggleNewChatPanel,
    panelRef: newChatPanelRef,
  } = usePanel();
  const {
    isOpen: isOpenNewGroupPanel,
    togglePanel: toggleNewGroupPanel,
    panelRef: newGroupPanelRef,
  } = usePanel();
  const {
    isOpen: isOpenProfilePanel,
    togglePanel: toggleProfilePanel,
    panelRef: ProfilePanelRef,
  } = usePanel();
  const panels: Record<string, SlidingPanelProps> = {
    profile: {
      isOpen: isOpenProfilePanel,
      togglePanel: toggleProfilePanel,
      panelRef: ProfilePanelRef,
      children: <Profile />,
      fromSide: "left",
      title: "Profile",
    },
    newChat: {
      isOpen: isOpenNewChatPanel,
      togglePanel: toggleNewChatPanel,
      panelRef: newChatPanelRef,
      children: (
        <ConversationLauncher
          label="new_chat"
          onSelectChat={onSelectChat}
          togglePanel={toggleNewChatPanel}
        />
      ),
      fromSide: "left",
      title: "New chat",
    },
    newGroup: {
      isOpen: isOpenNewGroupPanel,
      togglePanel: toggleNewGroupPanel,
      panelRef: newGroupPanelRef,
      children: <MultiConversationLauncher label="new_group" togglePanel={toggleNewGroupPanel}/>,
      fromSide: "left",
      title: "New group",
    },
  };
  const toggleHandlers = Object.keys(panels).reduce((acc, key) => {
    acc[key] = { togglePanel: panels[key].togglePanel };
    return acc;
  }, {} as Record<string, { togglePanel: () => void }>);

  return (
    <aside
      id="sidebar"
      className="col-span-1 h-screen bg-slate-700 md:border-r md:border-slate-500"
    >
      {Object.entries(panels).map(([key, panel]) => (
        <SlidingPanel
          key={key}
          isOpen={panel.isOpen}
          togglePanel={panel.togglePanel}
          panelRef={panel.panelRef}
          fromSide={panel.fromSide}
          title={panel.title}
        >
          {panel.children}
        </SlidingPanel>
      ))}
      <BlocContainer
        actions={sideBarActions}
        hasSearchField
        height="calc(100% - 7.5rem)"
        toggleHandlers={toggleHandlers}
        label="chat_list_sidebar"
      >
        <ConversationListItem onSelectChat={onSelectChat} />
      </BlocContainer>
    </aside>
  );
};
export default memo(ChatListSidebar);
