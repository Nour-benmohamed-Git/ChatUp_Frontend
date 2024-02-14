import ConversationListItem from "@/components/conversation-list-item/conversation-list-item";
import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import NoDataFound from "@/components/no-data-found/no-data-found";
import SlidingPanel from "@/components/sliding-panel/sliding-panel";
import { SlidingPanelProps } from "@/components/sliding-panel/sliding-panel.types";
import usePanel from "@/hooks/use-panel";
import { useGetCurrentUserChatSessionsQuery } from "@/redux/apis/chat-sessions/chatSessionsApi";
import { useGetCurrentUserQuery } from "@/redux/apis/profile/profileApi";
import { ChatSessionResponse } from "@/types/ChatSession";
import { sideBarActions } from "@/utils/constants/action-lists/sidebar-actions";
import { FC, memo, useEffect, useState } from "react";
import { toast } from "sonner";
import BlocContainer from "../bloc-container/bloc-container";
import ConversationLauncher from "../conversation-launcher/conversation-launcher";
import MultiConversationLauncher from "../multi-conversation-launcher/multi-conversation-launcher";
import Profile from "../profile/profile";
import { ChatListSidebarProps } from "./chat-list-sidebar.types";

const ChatListSidebar: FC<ChatListSidebarProps> = (props) => {
  const { handleSelectChatItem, socket } = props;
  const {
    data: currentUser,
    isLoading: isLoadingCurrentUser,
    error: currentUserError,
  } = useGetCurrentUserQuery();
  const { data, isLoading, error } = useGetCurrentUserChatSessionsQuery();
  const [chatSessions, setChatSessions] = useState<ChatSessionResponse[]>();
  useEffect(() => {
    if (data?.data) {
      setChatSessions(data.data);
    }
    socket?.on("notification", (chatSessionData) => {
      switch (chatSessionData.type) {
        case "updateChatListOnAddition":
          setChatSessions((prevChatSessions) => {
            return prevChatSessions?.map((chatSession) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  lastMessage: {
                    content: chatSessionData.data.lastMessage.content,
                    timestamp: chatSessionData.data.lastMessage.timestamp,
                    senderId: chatSessionData.data.lastMessage.senderId,
                  },
                  count: chatSessionData.count,
                };
              }
              return chatSession;
            });
          });
          break;
        case "markAsRead":
          setChatSessions((prevChatSessions) => {
            return prevChatSessions?.map((chatSession) => {
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
        case "updateChatListOnRemoval":
          setChatSessions((prevChatSessions) => {
            return prevChatSessions?.map((chatSession) => {
              if (chatSession.id === chatSessionData.data.id) {
                return {
                  ...chatSession,
                  lastMessage: {
                    content: chatSessionData.data.lastMessage.content,
                    timestamp: chatSessionData.data.lastMessage.timestamp,
                    senderId: chatSessionData.removerId,
                  },
                  count: chatSessionData.count,
                };
              }
              return chatSession;
            });
          });
          if (chatSessionData.removerId === currentUser?.data?.id) {
            toast.success("Message has been successfully removed.");
          }
          break;
        default:
          console.log("Unknown notification type:", chatSessionData.type);
      }
    });
    socket?.on("disconnect", () => {
      console.log("Disconnected from socket?.IO server");
    });
    // return () => {
    //   socket?.disconnect();
    //   socket?.off("notification");
    // };
  }, [data?.data]);

  let content = null;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <ErrorBox error={error} />;
  } else if (chatSessions?.length === 0) {
    content = <NoDataFound message="No data found" />;
  } else {
    content = chatSessions?.map?.((chatSession) => (
      <ConversationListItem
        handleSelectChatItem={handleSelectChatItem}
        key={chatSession.id}
        chatSession={chatSession}
      />
    ));
  }
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
      children: isOpenProfilePanel ? (
        <Profile
          data={currentUser?.data}
          isLoading={isLoadingCurrentUser}
          error={currentUserError}
        />
      ) : null,
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
          handleSelectChatItem={handleSelectChatItem}
          togglePanel={toggleNewChatPanel}
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
        userData={currentUser?.data}
      >
        {content}
      </BlocContainer>
    </aside>
  );
};
export default memo(ChatListSidebar);
