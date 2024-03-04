"use client";

import { logout } from "@/app/_actions/auth-actions/logout";
import Skeleton from "@/components/skeleton/skeleton";
import SlidingPanel from "@/components/sliding-panel/sliding-panel";
import { SlidingPanelProps } from "@/components/sliding-panel/sliding-panel.types";
import { useSocket } from "@/context/socket-context";
import usePanel from "@/hooks/use-panel";
import { ConversationResponse } from "@/types/ChatSession";
import {
  sideBarActions,
  sideBarMenuActions,
} from "@/utils/constants/action-lists/sidebar-actions";
import dynamic from "next/dynamic";
import { FC, Fragment, memo, useEffect, useState } from "react";
import BlocContainer from "../bloc-container/bloc-container";
import ConversationLauncher from "../conversation-launcher/conversation-launcher";
import MultiConversationLauncher from "../multi-conversation-launcher/multi-conversation-launcher";
import Profile from "../profile/profile";
import { ConversationListProps } from "./conversation-list.types";
const ConversationListItem = dynamic(
  () => import("@/components/conversation-list-item/conversation-list-item"),
  { loading: () => <Skeleton />, ssr: false }
);
const ConversationList: FC<ConversationListProps> = (props) => {
  const { initialConversations, initialUsers, currentUser } = props;
  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };
  const { socket } = useSocket();
  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  const [conversations, setConversations] =
    useState<ConversationResponse[]>(initialConversations);

  useEffect(() => {
    socket &&
      socket?.on("notification", (chatSessionData: any) => {
        switch (chatSessionData.type) {
          case "updateChatListOnAddition":
            setConversations((prevChatSessions: any) => {
              const chatSessionIndex = prevChatSessions.findIndex(
                (chatSession: any) => chatSession.id === chatSessionData.data.id
              );
              if (chatSessionIndex !== -1) {
                return prevChatSessions.map((chatSession: any) => {
                  if (chatSession.id === chatSessionData.data.id) {
                    return {
                      ...chatSession,
                      lastMessage: {
                        content: chatSessionData.data.lastMessage.content,
                        timestamp: chatSessionData.data.lastMessage.timestamp,
                      },
                      senderId: chatSessionData.senderId,
                      count: chatSessionData.count,
                    };
                  }
                  return chatSession;
                });
              } else {
                return [
                  ...prevChatSessions,
                  {
                    id: chatSessionData.data.id,
                    lastMessage: {
                      content: chatSessionData.data.lastMessage.content,
                      timestamp: chatSessionData.data.lastMessage.timestamp,
                    },
                    senderId: chatSessionData.senderId,
                    count: chatSessionData.count,
                    participantsData: chatSessionData.participantsData,
                  },
                ];
              }
            });
            break;
          case "markAsReadOnChatListUpdate":
            setConversations((prevChatSessions: any) => {
              return prevChatSessions?.map((chatSession: any) => {
                if (chatSession.id === chatSessionData.data.id) {
                  return {
                    ...chatSession,
                    count: chatSessionData.count,
                  };
                }
                return chatSession;
              });
            });
            break;
          case "updateChatListOnHardRemoval":
            setConversations((prevChatSessions: any) => {
              return prevChatSessions?.map((chatSession: any) => {
                if (chatSession.id === chatSessionData.data.id) {
                  return {
                    ...chatSession,
                    lastMessage: {
                      content: chatSessionData.data.lastMessage.content,
                      timestamp: chatSessionData.data.lastMessage.timestamp,
                    },
                    senderId: chatSessionData.senderId,
                    count: chatSessionData.count,
                  };
                }
                return chatSession;
              });
            });
            break;
          default:
            console.log("Unknown notification type:", chatSessionData.type);
        }
      });

    return () => {
      socket?.off(`user-${currentUser}`);
    };
  }, [socket, currentUser]);
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
      children: isOpenProfilePanel ? <Profile data={currentUser} /> : null,
      fromSide: "left",
      title: "Profile",
    },
    newChat: {
      isOpen: isOpenNewChatPanel,
      togglePanel: toggleNewChatPanel,
      panelRef: newChatPanelRef,
      children: isOpenNewChatPanel ? (
        <ConversationLauncher
          label="new_chat"
          togglePanel={toggleNewChatPanel}
          initialUsers={initialUsers}
        />
      ) : null,
      fromSide: "left",
      title: "New chat",
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

  return (
    <Fragment>
      <aside
        id="sidebar"
        className="col-span-1 h-full bg-slate-700 md:border-r md:border-slate-500"
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
          userData={currentUser}
          menuActionList={updatedSideBarMenuActions}
        >
          {conversations?.map?.((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </BlocContainer>
      </aside>
    </Fragment>
  );
};
export default memo(ConversationList);
