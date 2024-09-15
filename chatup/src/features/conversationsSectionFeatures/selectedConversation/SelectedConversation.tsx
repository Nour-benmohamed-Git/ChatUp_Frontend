"use client";
import { removeConversation } from "@/app/_actions/conversationActions/removeConversation";
import Dialog from "@/app/components/dialog/Dialog";
import SlidingPanel from "@/app/components/slidingPanel/SlidingPanel";
import { SlidingPanelProps } from "@/app/components/slidingPanel/SlidingPanel.types";
import { useRouter } from "next/navigation";
import { FC, memo, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendMessageSchema } from "@/utils/schemas/sendMessageSchema";
import BlocContainer from "@/features/blocContainer/BlocContainer";
import useConversation from "@/hooks/useConversation";
import usePanel from "@/hooks/usePanel";
import {
  conversationActions,
  conversationMenuActions,
} from "@/utils/constants/actionLists/conversationActions";
import ContactInfo from "../contactInfo/ContactInfo";
import MessageList from "../messageList/MessageList";
import SearchBar from "../searchBar/SearchBar";
import { useAudioCall } from "@/context/AudioCallContext";
import { SelectedConversationProps } from "./SelectedConversation.types";

const SelectedConversation: FC<SelectedConversationProps> = (props) => {
  const { conversationRelatedData, combinedData, initialConversations } = props;
  const { isOpen } = useConversation();
  const router = useRouter();
  const [paramToSearch, setParamToSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const { startAudioCall, setCombinedData } = useAudioCall();

  const handleCloseConversation = () => {
    router.push("/conversations");
  };
  useEffect(() => {
    if (combinedData) {
      setCombinedData(combinedData);
    }
  }, [combinedData]);

  const handleRemoveConversation = async () => {
    await removeConversation({
      conversationId: conversationRelatedData.conversationId as number,
    });
    router.push("/conversations");
  };
  const openModal = () => {
    setOpenDialog(true);
  };
  const closeModal = () => {
    setOpenDialog(false);
  };
  const onClickFunctions: { [key: string]: () => void } = {
    closeConversation: handleCloseConversation,
    removeConversation: openModal,
    block: () => console.log("block"),
  };

  const updatedConversationMenuActions = useMemo(
    () =>
      conversationMenuActions.map((action) => ({
        ...action,
        onClick: onClickFunctions[action.label],
      })),
    [conversationMenuActions]
  );

  const {
    isOpen: isOpenSearchMessagesPanel,
    togglePanel: toggleSearchMessagesPanel,
    panelRef: searchMessagesPanelRef,
  } = usePanel(false);

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
        <SearchBar
          setParamToSearch={setParamToSearch}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          setCurrentSearchIndex={setCurrentSearchIndex}
          toggleSearchBar={toggleSearchMessagesPanel}
          setSearchResults={setSearchResults}
        />
      ) : null,
      fromSide: "top",
      title: "Search messages",
      panelHeight: "h-32",
      hasHeader: false,
      zIndex: "z-10",
    },
    contactInfo: {
      isOpen: isOpenContactInfoPanel,
      togglePanel: toggleContactInfoPanel,
      panelRef: contactInfoPanelRef,
      children: isOpenContactInfoPanel ? (
        <ContactInfo
          combinedData={combinedData}
          onMessage={toggleContactInfoPanel}
          onAudioCall={() => {}}
          onVideoCall={() => {}}
          onBlock={() => {}}
          onRemoveConversation={() => {}}
        />
      ) : null,
      fromSide: "right",
      title: "Contact info",
    },
  };
  const toggleHandlers = Object.keys(panels).reduce((acc, key) => {
    acc[key] = { togglePanel: panels[key].togglePanel };
    return acc;
  }, {} as Record<string, { togglePanel: () => void }>);
  const methods = useForm<z.infer<typeof sendMessageSchema>>({
    defaultValues: {
      id: 0,
      message: "",
      files: [],
      reaction: "",
    },
    mode: "all",
    resolver: zodResolver(sendMessageSchema),
  });

  return (
    <>
      {openDialog && (
        <Dialog
          title="Remove Conversation"
          onClose={closeModal}
          actions={[
            {
              label: "remove",
              onClick: handleRemoveConversation,
              category: "dismissal",
            },
          ]}
        >
          Are you sure you want to remove this chat session?
        </Dialog>
      )}
      <main
        id="main_content"
        className={`relative ${
          isOpen ? "flex flex-col" : "hidden"
        } md:flex md:flex-col md:col-span-7 lg:col-span-8 bg-gradient-to-r from-slate-600 to-gray-700`}
      >
        {Object.entries(panels).map(([key, panel]) => (
          <SlidingPanel
            key={key}
            isOpen={panel.isOpen}
            togglePanel={panel.togglePanel}
            panelRef={panel.panelRef}
            fromSide={panel.fromSide}
            title={panel.title}
            panelHeight={panel.panelHeight}
            panelWidth={panel.panelWidth}
            hasHeader={panel.hasHeader}
            zIndex={panel.zIndex}
          >
            {panel.children}
          </SlidingPanel>
        ))}
        <FormProvider {...methods}>
          <BlocContainer
            actions={conversationActions}
            hasChatControlPanel
            toggleHandlers={toggleHandlers}
            label="selected_conversation"
            menuActionList={updatedConversationMenuActions}
            conversationRelatedData={conversationRelatedData}
            combinedData={combinedData}
            cssClass="h-[calc(100vh-8rem)]"
            handleBack={handleCloseConversation}
            startAudioCall={startAudioCall}
          >
            <MessageList
              conversationRelatedData={conversationRelatedData}
              combinedData={combinedData}
              paramToSearch={paramToSearch}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              currentSearchIndex={currentSearchIndex}
              setCurrentSearchIndex={setCurrentSearchIndex}
              initialConversations={initialConversations}
            />
          </BlocContainer>
        </FormProvider>
      </main>
    </>
  );
};

export default memo(SelectedConversation);
