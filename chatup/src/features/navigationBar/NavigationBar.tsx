"use client";
import { useSocket } from "@/context/SocketContext";
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
      // console.log("handleConversationCount", data);
      setConversationCount(data.unseenConversations);
    };
    const handleFriendRequestCount = (data: {
      unseenFriendRequests: number;
    }) => {
      setFriendRequestCount(data.unseenFriendRequests);
    };

    if (socket) {
      socket.on("conversation_count", handleConversationCount);
      socket.on("friend_request_count", handleFriendRequestCount);
    }
    const handleFriendRequestNotification = (friendRequestData: any) => {
      console.log("friendRequestData", friendRequestData);
      switch (friendRequestData.action) {
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
      socket.on("friend_request_notification", handleFriendRequestNotification);
    }

    return () => {
      socket?.off("conversation_count", handleConversationCount);
      socket?.off("friend_request_count", handleFriendRequestCount);
      socket?.off(
        "friend_request_notification",
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
