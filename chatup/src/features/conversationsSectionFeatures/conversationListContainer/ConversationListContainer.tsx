"use client";
import { logout } from "@/app/_actions/authActions/logout";
import useConversation from "@/hooks/useConversation";
import { sideBarMenuActions } from "@/utils/constants/actionLists/sideBarActions";
import { FC, memo } from "react";
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
      className={`h-full ${
        isOpen ? "hidden" : "flex flex-col"
      } md:flex md:flex-col md:col-span-5 lg:col-span-4 md:border-r md:border-slate-500 bg-gradient-to-r from-slate-600 to-gray-700`}
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
    </aside>
  );
};
export default memo(ConversationListContainer);
