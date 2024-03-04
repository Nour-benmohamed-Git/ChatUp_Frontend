"use client";
import SlidingPanel from "@/components/sliding-panel/sliding-panel";
import { SlidingPanelProps } from "@/components/sliding-panel/sliding-panel.types";
import usePanel from "@/hooks/use-panel";
import {
  conversationActions,
  conversationMenuActions,
} from "@/utils/constants/action-lists/conversation-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, memo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import BlocContainer from "../bloc-container/bloc-container";
import MessageWrapper from "../message-wrapper/message-wrapper";
import { SelectedConversationProps } from "./selected-conversation.types";

const schema = z.object({
  message: z.string().min(1, "message is required."),
});
const SelectedConversation: FC<SelectedConversationProps> = (props) => {
  const { conversationRelatedData, initialMessages, userData } = props;
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
  const methods = useForm({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(schema),
  });
  return (
    <main
      id="main_content"
      className="md:flex flex-col col-span-2 h-full bg-slate-700"
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
      <FormProvider {...methods}>
        <BlocContainer
          actions={conversationActions}
          hasChatControlPanel
          height="calc(100% - 8rem)"
          toggleHandlers={toggleHandlers}
          label="chat_conversation"
          menuActionList={updatedConversationMenuActions}
          conversationRelatedData={conversationRelatedData}
          userData={userData}
        >
          <MessageWrapper
            conversationRelatedData={conversationRelatedData}
            initialMessages={initialMessages}
          />
        </BlocContainer>
      </FormProvider>
    </main>
  );
};
export default memo(SelectedConversation);
