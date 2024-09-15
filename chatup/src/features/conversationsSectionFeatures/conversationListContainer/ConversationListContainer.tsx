"use client";
import { logout } from "@/app/_actions/authActions/logout";
import { addConversation } from "@/app/_actions/conversationActions/addConversation";
import { createMessage } from "@/app/_actions/messageActions/createMessage";
import Dialog from "@/app/components/dialog/Dialog";
import { useSocket } from "@/context/SocketContext";
import useConversation from "@/hooks/useConversation";
import { ConversationResponse } from "@/types/ChatSession";
import { MessageResponse } from "@/types/Message";
import { sideBarMenuActions } from "@/utils/constants/actionLists/sideBarActions";
import {
  ChatSessionType,
  ConversationFilter,
  MessageType,
} from "@/utils/constants/globals";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { groupConversationSchema } from "@/utils/schemas/conversationSchemaSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, memo, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BlocContainer from "../../blocContainer/BlocContainer";
import ConversationList from "../conversationList/ConversationList";
import GroupForm from "../groupForm/GroupForm";
import UsersPicker from "../usersPicker/UsersPicker";
import { ConversationListContainerProps } from "./ConversationListContainer.types";
const ConversationListContainer: FC<ConversationListContainerProps> = (
  props
) => {
  const { initialConversations, currentUser, initialFriends } = props;
  const { isOpen } = useConversation();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>(
    ConversationFilter.ALL
  );

  const { socket } = useSocket();
  const [openNewGroup, setOpenNewGroup] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm<z.infer<typeof groupConversationSchema>>({
    defaultValues: {
      title: "",
      image: "",
      type: ChatSessionType.GROUP,
      otherMembersIds: [],
    },
    mode: "all",
    resolver: zodResolver(groupConversationSchema),
  });
  const openNewGroupModal = () => {
    setOpenNewGroup(true);
  };
  const toggleToArchive = () => {
    setActiveFilter(ConversationFilter.ARCHIVED);
  };

  const onClickFunctions: { [key: string]: () => void } = {
    newGroup: openNewGroupModal,
    archived: toggleToArchive,
    logout: logout,
  };

  const handleGoBackToConversations = () => {
    setActiveFilter(ConversationFilter.ALL);

    router.push("/conversations");
  };
  const updatedSideBarMenuActions = useMemo(
    () =>
      sideBarMenuActions["chat"].map((action) => ({
        ...action,
        onClick: onClickFunctions[action.label],
      })),
    [sideBarMenuActions]
  );
  const closeNewGroupModal = () => {
    setOpenNewGroup(false);
    setCurrentStep(1);
    methods.reset();
  };

  const handleNextClick = () => {
    setCurrentStep(2);
  };

  const handlePreviousClick = () => {
    setCurrentStep(1);
  };
  const handleCreateMessage = async (chatSession: ConversationResponse) => {
    const messageToCreate = {
      content: `Group created by ${currentUser.username}`,
      type: MessageType.SYSTEM,
      senderId: currentUser.id,
      chatSessionId: chatSession.id,
    };

    const formData = new FormData();
    Object.entries(messageToCreate).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    await createMessage(formData)
      .then((res) => {
        socket &&
          emitMessage(socket, {
            action: "create",
            message: res.data?.data as MessageResponse,
          });
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleCreateGroup = async () => {
    const formData = new FormData();
    Object.entries(methods.watch()).forEach(([key, value]) => {
      if (key === "otherMembersIds") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const conversation = (await addConversation(null, formData)) as {
      data: { data: ConversationResponse };
    };

    if (conversation) {
      await handleCreateMessage(conversation.data?.data);
      closeNewGroupModal();
    }
  };
  return (
    <>
      {openNewGroup && (
        <Dialog
          title="New group"
          onClose={closeNewGroupModal}
          showCancelButton={currentStep === 1}
          {...(methods.watch("otherMembersIds").length && {
            actions:
              currentStep === 1
                ? [
                    {
                      label: "next",
                      onClick: handleNextClick,
                      category: "confirmation",
                    },
                  ]
                : [
                    {
                      label: "previous",
                      onClick: handlePreviousClick,
                      category: "dismissal",
                    },
                    {
                      label: "confirm",
                      onClick: handleCreateGroup,
                      category: "confirmation",
                      disabled: !methods.formState.isValid,
                    },
                  ],
          })}
        >
          <FormProvider {...methods}>
            {currentStep === 1 ? (
              <UsersPicker initialFriends={initialFriends} />
            ) : (
              <GroupForm
                initialFriends={initialFriends}
                checkedUsers={methods.watch("otherMembersIds")}
              />
            )}
          </FormProvider>
        </Dialog>
      )}
      <aside
        id="sidebar"
        className={`h-full ${
          isOpen ? "hidden" : "flex flex-col"
        } md:flex md:flex-col md:col-span-5 lg:col-span-4 md:border-r md:border-slate-500 bg-gradient-to-r from-slate-600 to-gray-700`}
      >
        <BlocContainer
          title={
            activeFilter !== ConversationFilter.ARCHIVED ? "Chat" : "Archived"
          }
          label={
            activeFilter === ConversationFilter.ARCHIVED
              ? "archived"
              : undefined
          }
          menuActionList={updatedSideBarMenuActions}
          cssClass="p-2 h-[calc(100vh-4rem)]"
          handleBack={handleGoBackToConversations}
        >
          <ConversationList
            label={
              activeFilter !== ConversationFilter.ARCHIVED
                ? "conversations"
                : "archived"
            }
            initialConversations={initialConversations}
            currentUser={currentUser}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </BlocContainer>
      </aside>
    </>
  );
};
export default memo(ConversationListContainer);
