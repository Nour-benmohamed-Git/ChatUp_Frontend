"use client";

import MessagesLoader from "@/app/components/messagesLoader/MessagesLoader";
import SlidingPanel from "@/app/components/sliding-panel/sliding-panel";
import { SlidingPanelProps } from "@/app/components/sliding-panel/sliding-panel.types";
import BlocContainer from "@/features/bloc-container/bloc-container";
import useConversation from "@/hooks/useConversation";
import usePanel from "@/hooks/usePanel";
import {
  conversationActions,
  conversationMenuActions,
} from "@/utils/constants/action-lists/conversation-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { FC, memo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { SelectedConversationProps } from "./SelectedConversation.types";

const MessageList = dynamic(() => import("../messageList/MessageList"), {
  loading: () => <MessagesLoader />,
  ssr: false,
});

const schema = z.object({
  message: z.string().min(1, "message is required."),
});
const SelectedConversation: FC<SelectedConversationProps> = (props) => {
  const { conversationRelatedData, initialMessages, userData } = props;
  const { isOpen } = useConversation();

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
  const methods = useForm<{ id?: number; message: string }>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(schema),
  });
  return (
    <main
      id="main_content"
      className={`${
        isOpen ? "flex flex-col" : "hidden"
      } md:flex md:flex-col md:col-span-7 lg:col-span-8 h-full`}
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
          toggleHandlers={toggleHandlers}
          label="right_container"
          menuActionList={updatedConversationMenuActions}
          conversationRelatedData={conversationRelatedData}
          userData={userData}
          cssClass="h-[calc(100vh-8rem)]"
        >
          <MessageList
            conversationRelatedData={conversationRelatedData}
            initialMessages={initialMessages}
          />
        </BlocContainer>
      </FormProvider>
    </main>
  );
};
export default memo(SelectedConversation);
