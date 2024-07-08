"use client";
import { removeConversation } from "@/app/_actions/conversationActions/removeConversation";
import Dialog from "@/app/components/dialog/Dialog";
import MessagesLoader from "@/app/components/messagesLoader/MessagesLoader";
import SlidingPanel from "@/app/components/slidingPanel/SlidingPanel";
import { SlidingPanelProps } from "@/app/components/slidingPanel/SlidingPanel.types";
import BlocContainer from "@/features/blocContainer/BlocContainer";
import useConversation from "@/hooks/useConversation";
import usePanel from "@/hooks/usePanel";
import {
  conversationActions,
  conversationMenuActions,
} from "@/utils/constants/actionLists/conversationActions";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, memo, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import ContactInfo from "../contactInfo/ContactInfo";
import SearchBar from "../searchBar/SearchBar";
import { SelectedConversationProps } from "./SelectedConversation.types";

const MessageList = dynamic(() => import("../messageList/MessageList"), {
  loading: () => <MessagesLoader />,
  ssr: false,
});

const schema = z.object({
  message: z.string().min(1, "message is required."),
});
const SelectedConversation: FC<SelectedConversationProps> = (props) => {
  const { conversationRelatedData, initialMessages, userData, files } = props;
  const messageListRef = useRef<HTMLDivElement>(null);
  const [paramToSearch, setParamToSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const imagesAndVideos = files
    ?.filter(
      (file: any) =>
        file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")
    )
    .slice(0, 12);
  const [openDialog, setOpenDialog] = useState(false);
  const { isOpen } = useConversation();
  const router = useRouter();
  const handleCloseConversation = () => {
    router.push("/conversations");
  };
  const openModal = () => {
    setOpenDialog(true);
  };
  const closeModal = () => {
    setOpenDialog(false);
  };
  const handleRemoveConversation = async () => {
    await removeConversation({
      conversationId: conversationRelatedData.conversationId as number,
    });
    closeModal();
    router.push("/conversations");
  };
  const onClickFunctions: { [key: string]: () => void } = {
    closeConversation: handleCloseConversation,
    removeConversation: openModal,
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
        <SearchBar
          setParamToSearch={setParamToSearch}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          setCurrentSearchIndex={setCurrentSearchIndex}
        />
      ) : null,
      fromSide: "top",
      title: "Search messages",
      panelHeight: "h-32",
    },
    contactInfo: {
      isOpen: isOpenContactInfoPanel,
      togglePanel: toggleContactInfoPanel,
      panelRef: contactInfoPanelRef,
      children: isOpenContactInfoPanel ? (
        <ContactInfo
          userData={userData}
          files={imagesAndVideos}
          lastSeen={"azdazd"}
          onMessage={toggleContactInfoPanel}
          onAudioCall={function (): void {
            throw new Error("Function not implemented.");
          }}
          onVideoCall={function (): void {
            throw new Error("Function not implemented.");
          }}
          onBlock={function (): void {
            throw new Error("Function not implemented.");
          }}
          onRemoveConversation={function (): void {
            throw new Error("Function not implemented.");
          }}
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
  const methods = useForm<{ id?: number; message: string; files?: File[] }>({
    defaultValues: {
      message: "",
      files: [],
    },
    resolver: zodResolver(schema),
  });
  
  // useEffect(() => {
  //   if (!isOpenSearchMessagesPanel) {
  //     setParamToSearch("");
  //   }
  // }, [isOpenSearchMessagesPanel]);

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
            panelHeight={panel?.panelHeight}
            panelWidth={panel?.panelWidth}
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
            messageListRef={messageListRef}
          >
            <MessageList
              conversationRelatedData={conversationRelatedData}
              initialMessages={initialMessages}
              messageListRef={messageListRef}
              paramToSearch={paramToSearch}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              currentSearchIndex={currentSearchIndex}
              setCurrentSearchIndex={setCurrentSearchIndex}
            />
          </BlocContainer>
        </FormProvider>
      </main>
    </>
  );
};
export default memo(SelectedConversation);
