import SlidingPanel from "@/components/sliding-panel/sliding-panel";
import { SlidingPanelProps } from "@/components/sliding-panel/sliding-panel.types";
import usePanel from "@/hooks/use-panel";
import {
  conversationActions,
  conversationMenuActions,
} from "@/utils/constants/action-lists/conversation-actions";
import { FC, memo } from "react";
import BlocContainer from "../bloc-container/bloc-container";
import MessageListView from "../message-list-view/message-list-view";
import { ChatConversationProps } from "./chat-conversation.types";
import { useGetUserByIdQuery } from "@/redux/apis/user/userApi";
import { useGetMessagesByChatSessionIdQuery } from "@/redux/apis/chat-sessions/chatSessionsApi";

const ChatConversation: FC<ChatConversationProps> = (props) => {
  const { selectedChatItem, handleSelectChatItem, socket } = props;
  const { data, isLoading, error } = useGetUserByIdQuery(
    selectedChatItem.secondMemberId as number
  );
  const onClickFunctions: { [key: string]: () => void } = {
    closeConversation: () => console.log("closeConversation"),
    removeConversation: () => console.log("removeConversation"),
    block: () => console.log("block"),
  };

  const updatedConversationMenuActions = conversationMenuActions.map(
    (action) => ({
      ...action,
      onClick: onClickFunctions[action.label],
    })
  );
  const {
    isOpen: isOpenSearchMessagesPanel,
    togglePanel: toggleSearchMessagesPanel,
    panelRef: searchMessagesPanelRef,
  } = usePanel();
  const {
    isOpen: isOpenContactInfoPanel,
    togglePanel: toggleContactInfoPanel,
    panelRef: contactInfoPanelRef,
  } = usePanel();
  const panels: Record<string, SlidingPanelProps> = {
    searchMessages: {
      isOpen: isOpenSearchMessagesPanel,
      togglePanel: toggleSearchMessagesPanel,
      panelRef: searchMessagesPanelRef,
      children: isOpenSearchMessagesPanel ? (
        <h2>Sliding Panel Content</h2>
      ) : null,
      fromSide: "right",
      title: "Search messages",
    },
    contactInfo: {
      isOpen: isOpenContactInfoPanel,
      togglePanel: toggleContactInfoPanel,
      panelRef: contactInfoPanelRef,
      children: isOpenContactInfoPanel ? <h2>Sliding Panel Content</h2> : null,
      fromSide: "right",
      title: "Contact info",
    },
  };
  const toggleHandlers = Object.keys(panels).reduce((acc, key) => {
    acc[key] = { togglePanel: panels[key].togglePanel };
    return acc;
  }, {} as Record<string, { togglePanel: () => void }>);
  return (
    <main id="main_content" className="col-span-2 h-screen bg-slate-700">
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
        actions={conversationActions}
        hasChatControlPanel
        height="calc(100% - 8rem)"
        toggleHandlers={toggleHandlers}
        label="chat_conversation"
        selectedChatItem={selectedChatItem}
        handleSelectChatItem={handleSelectChatItem}
        socket={socket}
        menuActionList={updatedConversationMenuActions}
        userData={data?.data}
      >
        <MessageListView
          selectedChatItem={selectedChatItem}
          handleSelectChatItem={handleSelectChatItem}
          socket={socket}
        />
      </BlocContainer>
    </main>
  );
};
export default memo(ChatConversation);
