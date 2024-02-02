import ConversationListItem from "@/components/conversation-list-item/conversation-list-item";
import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import NoDataFound from "@/components/no-data-found/no-data-found";
import SlidingPanel from "@/components/sliding-panel/sliding-panel";
import { SlidingPanelProps } from "@/components/sliding-panel/sliding-panel.types";
import usePanel from "@/hooks/use-panel";
import { useGetCurrentUserChatSessionsQuery } from "@/redux/apis/chat-sessions/chatSessionsApi";
import { sideBarActions } from "@/utils/constants/action-lists/sidebar-actions";
import { FC, memo } from "react";
import BlocContainer from "../bloc-container/bloc-container";
import ConversationLauncher from "../conversation-launcher/conversation-launcher";
import MultiConversationLauncher from "../multi-conversation-launcher/multi-conversation-launcher";
import Profile from "../profile/profile";
import { ChatListSidebarProps } from "./chat-list-sidebar.types";
import { useGetCurrentUserQuery } from "@/redux/apis/profile/profileApi";

const ChatListSidebar: FC<ChatListSidebarProps> = (props) => {
  const { handleSelectChatItem } = props;
  const { data, isLoading, error } = useGetCurrentUserChatSessionsQuery();
  const {
    data: currentUserInfo,
    isLoading: isLoadingCurrentUserInfo,
    error: currentUserInfoError,
  } = useGetCurrentUserQuery();
  let content = null;
  if (isLoading) {
    content = <Loader />;
  }

  if (error || currentUserInfoError) {
    content = <ErrorBox error={error || currentUserInfoError} />;
  }

  if (data?.data?.length === 0) {
    content = <NoDataFound message="No data found" />;
  }
  content =
    currentUserInfo &&
    data?.data?.map?.((chatSession) => (
      <ConversationListItem
        handleSelectChatItem={handleSelectChatItem}
        key={chatSession.id}
        chatSession={chatSession}
        currentUserId={`${currentUserInfo.id}`}
      />
    ));
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
      children: (
        <Profile
          data={currentUserInfo}
          isLoading={isLoadingCurrentUserInfo}
          error={currentUserInfoError}
        />
      ),
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
          handleSelectChatItem={handleSelectChatItem}
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
      children: (
        <MultiConversationLauncher
          label="new_group"
          togglePanel={toggleNewGroupPanel}
        />
      ),
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
        {content}
      </BlocContainer>
    </aside>
  );
};
export default memo(ChatListSidebar);
