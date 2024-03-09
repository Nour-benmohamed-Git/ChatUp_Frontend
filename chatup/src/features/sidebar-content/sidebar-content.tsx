"use client";

import { logout } from "@/app/_actions/auth-actions/logout";
import SlidingPanel from "@/components/sliding-panel/sliding-panel";
import { SlidingPanelProps } from "@/components/sliding-panel/sliding-panel.types";
import Tabs from "@/components/tabs/tabs";
import useConversation from "@/hooks/use-conversation";
import usePanel from "@/hooks/use-panel";
import {
  sideBarActions,
  sideBarMenuActions,
} from "@/utils/constants/action-lists/sidebar-actions";
import { tabsActions } from "@/utils/constants/action-lists/tabs-actions";
import Link from "next/link";
import { FC, Fragment, ReactNode, memo } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import BlocContainer from "../bloc-container/bloc-container";
import ConversationList from "../conversation-list/conversation-list";
import FriendList from "../friend-list/friend-list";
import MultiConversationLauncher from "../multi-conversation-launcher/multi-conversation-launcher";
import Profile from "../profile/profile";
import { SidebarContentProps } from "./sidebar-content.types";

const SidebarContent: FC<SidebarContentProps> = (props) => {
  const { initialConversations, initialFriends, currentUser } = props;
  const { isOpen } = useConversation();

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

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
      children: isOpenProfilePanel ? <Profile data={currentUser} /> : null,
      fromSide: "left",
      title: "Profile",
    },
    newGroup: {
      isOpen: isOpenNewGroupPanel,
      togglePanel: toggleNewGroupPanel,
      panelRef: newGroupPanelRef,
      children: isOpenNewGroupPanel ? (
        <MultiConversationLauncher
          label="new_group"
          togglePanel={toggleNewGroupPanel}
        />
      ) : null,
      fromSide: "left",
      title: "New group",
    },
  };
  const toggleHandlers = Object.keys(panels).reduce((acc, key) => {
    acc[key] = { togglePanel: panels[key].togglePanel };
    return acc;
  }, {} as Record<string, { togglePanel: () => void }>);
  const components: { [key: string]: ReactNode } = {
    conversations: (
      <ConversationList
        label="Friends"
        initialConversations={initialConversations}
        currentUser={currentUser}
      />
    ),
    friends: <FriendList label="Friends" initialFriends={initialFriends} />,
  };

  const updatedTabsActions = tabsActions.map((action) => ({
    ...action,
    content: components[action.key],
  }));
  return (
    <Fragment>
      <aside
        id="sidebar"
        className={`relative ${
          isOpen ? "hidden" : "flex flex-col"
        } md:flex md:flex-col md:col-span-2 lg:col-span-1 h-full bg-slate-700 md:border-r md:border-slate-500`}
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
          toggleHandlers={toggleHandlers}
          label="conversation_list_sidebar"
          userData={currentUser}
          menuActionList={updatedSideBarMenuActions}
          cssClass="p-2 h-[calc(100vh-3.5rem)]"
        >
          <Tabs tabs={updatedTabsActions} />
        </BlocContainer>
        <Link
          href="/conversation/friend-ship-manager"
          className={`flex items-center justify-center absolute bg-gray-900 rounded-full shadow-2xl z-30 right-4 bottom-4 h-11 w-11`}
        >
          <BsPersonFillAdd size={24} style={{ color: "#ffa500" }} />
        </Link>
      </aside>
    </Fragment>
  );
};
export default memo(SidebarContent);
