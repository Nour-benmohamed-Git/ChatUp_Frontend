"use client";
import { logout } from "@/app/_actions/authActions/logout";
import Tabs from "@/app/components/tabs/Tabs";
import { useSocket } from "@/context/SocketContext";
import BlocContainer from "@/features/blocContainer/BlocContainer";
import { sideBarMenuActions } from "@/utils/constants/actionLists/sideBarActions";
import { tabsActions } from "@/utils/constants/actionLists/tabsActions";
import { emitFriendRequest } from "@/utils/helpers/socket-helpers";
import { FC, ReactNode, memo, useEffect, useMemo } from "react";
import FriendList from "../friendList/FriendList";
import FriendRequestList from "../friendRequestList/FriendRequestList";
import { FriendsContainerProps } from "./FriendsContainer.types";

const FriendsContainer: FC<FriendsContainerProps> = (props) => {
  const { initialFriendRequests, initialFriends, currentUser } = props;
  const components: { [key: string]: ReactNode } = {
    FriendRequests: (
      <FriendRequestList
        label="friend_requests"
        initialFriendRequests={initialFriendRequests}
      />
    ),
    friends: <FriendList label="friends" initialFriends={initialFriends} />,
  };
  const updatedTabsActions = useMemo(
    () =>
      tabsActions.map((action) => ({
        ...action,
        content: components[action.key],
      })),
    [tabsActions]
  );

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions["friends"].map(
    (action) => ({
      ...action,
      onClick: onClickFunctions[action.label],
    })
  );

  const { socket } = useSocket();

  useEffect(() => {
    socket &&
      emitFriendRequest(socket, {
        action: "markAsSeen",
        friendRequest: { receiverId: currentUser?.id },
      });
  }, [socket, currentUser?.id]);
  return (
    <aside
      id="sidebar"
      className="md:flex md:flex-col md:col-span-5 h-full lg:col-span-4 md:border-r md:border-slate-500 bg-gradient-to-r from-slate-600 to-gray-700"
    >
      <BlocContainer
        title="Friends"
        menuActionList={updatedSideBarMenuActions}
        cssClass="p-2 h-[calc(100vh-4rem)]"
      >
        <Tabs tabs={updatedTabsActions} />
      </BlocContainer>
    </aside>
  );
};
export default memo(FriendsContainer);
