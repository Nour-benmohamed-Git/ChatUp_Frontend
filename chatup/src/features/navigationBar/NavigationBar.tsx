"use client";
import { useSocket } from "@/context/socket-context";
import useRoutes, { labelsWithBadge } from "@/hooks/useRoutes";
import { FC, memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { NavigationBarProps } from "./NavigationBar.types";
import DesktopNavigationBar from "./components/desktopNavigationBar/DesktopNavigationBar";
import MobileNavigationBar from "./components/mobileNavigationBar/MobileNavigationBar";

const NavigationBar: FC<NavigationBarProps> = (props) => {
  const {
    currentUser,
    initialUnseenConversationsCount,
    initialUnseenFriendRequestsCount,
  } = props;
  const routes = useRoutes();
  const { socket } = useSocket();
  const [conversationCount, setConversationCount] = useState<number>(
    initialUnseenConversationsCount
  );

  const [friendRequestCount, setFriendRequestCount] = useState<number>(
    initialUnseenFriendRequestsCount
  );
  useEffect(() => {
    const handleConversationCount = (data: { unseenConversations: number }) => {
      setConversationCount(data.unseenConversations);
    };
    const handleFriendRequestCount = (data: {
      unseenFriendRequests: number;
    }) => {
      setFriendRequestCount(data.unseenFriendRequests);
    };

    if (socket) {
      socket.on("conversationCount", handleConversationCount);
      socket.on("friendRequestCount", handleFriendRequestCount);
    }
    const handleFriendRequestNotification = (friendRequestData: any) => {
      console.log("friendRequestData", friendRequestData);
      switch (friendRequestData.action) {
        // case "send":

        //   break;

        case "accept":
          toast.info(friendRequestData.message);
          break;
        case "decline":
          toast.info(friendRequestData.message);
          break;
        default:
          console.log("Unknown notification action:", friendRequestData.action);
      }
    };

    if (socket) {
      socket.on("friend-request-notification", handleFriendRequestNotification);
    }

    return () => {
      socket?.off("conversationCount", handleConversationCount);
      socket?.off("friendRequestCount", handleFriendRequestCount);
      socket?.off(
        "friend-request-notification",
        handleFriendRequestNotification
      );
    };
  }, [socket]);

  const countSections: { [key: string]: number } = {
    chat: conversationCount,
    friends: friendRequestCount,
  };
  const routesWithBadge = routes
    .filter((item) => labelsWithBadge.includes(item.label))
    .map((el) => ({ ...el, count: countSections[el.label] }));

  useEffect(() => {
    return () => {};
  }, [socket]);
  return (
    <>
      <DesktopNavigationBar
        currentUser={currentUser}
        routesWithBadge={routesWithBadge}
        routes={routes}
      />
      <MobileNavigationBar
        currentUser={currentUser}
        routesWithBadge={routesWithBadge}
        routes={routes}
      />
    </>
  );
};

export default memo(NavigationBar);
