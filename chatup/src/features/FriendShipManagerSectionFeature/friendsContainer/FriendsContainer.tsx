"use client";

import { logout } from "@/app/_actions/auth-actions/logout";
import Tabs from "@/app/components/tabs/tabs";
import { useSocket } from "@/context/socket-context";
import BlocContainer from "@/features/bloc-container/bloc-container";
import { sideBarMenuActions } from "@/utils/constants/action-lists/sidebar-actions";
import { tabsActions } from "@/utils/constants/action-lists/tabs-actions";
import { emitFriendRequest } from "@/utils/helpers/socket-helpers";
import { FC, ReactNode, memo, useEffect } from "react";
import FriendList from "../friendList/FriendList";
import FriendRequestList from "../friendRequestList/FriendRequestList";
import { FriendsContainerProps } from "./FriendsContainer.types";

const FriendsContainer: FC<FriendsContainerProps> = (props) => {
  const { initialFriendRequests, initialFriends, currentUser } = props;
  const components: { [key: string]: ReactNode } = {
    FiendRequests: <FriendRequestList friendRequests={initialFriendRequests} />,
    friends: <FriendList label="Friends" initialFriends={initialFriends} />,
  };
  const updatedTabsActions = tabsActions.map((action) => ({
    ...action,
    content: components[action.key],
  }));

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  const { socket } = useSocket();

  useEffect(() => {
    socket &&
      emitFriendRequest(socket, {
        action: "markAsSeen",
        friendRequest: { receiverId: currentUser?.id },
      });
  }, [socket]);
  return (
    <aside
      id="sidebar"
      className="md:flex md:flex-col md:col-span-5 h-full lg:col-span-4 md:border-r md:border-slate-500"
    >
      <BlocContainer
        title="Friends"
        label="left_container"
        menuActionList={updatedSideBarMenuActions}
        cssClass="p-2 h-[calc(100vh-3.5rem)]"
      >
        <Tabs tabs={updatedTabsActions} />
      </BlocContainer>
    </aside>
  );
};
export default memo(FriendsContainer);
