"use client";
import { logout } from "@/app/_actions/authActions/logout";
import useConversation from "@/hooks/useConversation";
import { sideBarMenuActions } from "@/utils/constants/actionLists/sideBarActions";
import Link from "next/link";
import { FC, memo } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import BlocContainer from "../../blocContainer/BlocContainer";
import ConversationList from "../conversationList/ConversationList";
import { ConversationListContainerProps } from "./ConversationListContainer.types";

const ConversationListContainer: FC<ConversationListContainerProps> = (
  props
) => {
  const { initialConversations, currentUser } = props;
  const { isOpen } = useConversation();

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  return (
    <aside
      id="sidebar"
      className={`relative ${
        isOpen ? "hidden" : "flex flex-col"
      } md:flex md:flex-col md:col-span-5 h-full lg:col-span-4 md:border-r md:border-slate-500`}
    >
      <BlocContainer
        title="Chat"
        label="left_container"
        menuActionList={updatedSideBarMenuActions}
        cssClass="p-2 h-[calc(100vh-4rem)]"
      >
        <ConversationList
          label="Friends"
          initialConversations={initialConversations}
          currentUser={currentUser}
        />
      </BlocContainer>
      <Link
        href="/add-friend"
        className={`hidden md:flex items-center justify-center absolute bg-gray-900 rounded-full shadow-2xl z-30 right-4 bottom-4 h-11 w-11`}
      >
        <BsPersonFillAdd size={24} style={{ color: "#ffa500" }} />
      </Link>
    </aside>
  );
};
export default memo(ConversationListContainer);
