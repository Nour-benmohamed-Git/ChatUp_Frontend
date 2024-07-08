"use client";
import { useSocket } from "@/context/SocketContext";
import PanelContentWrapper from "@/features/panelContentWrapper/PanelContentWrapper";
import { FriendRequestResponse } from "@/types/FriendRequest";
import { FC, memo, useEffect, useState } from "react";
import FriendRequestItem from "../friendRequestItem/FriendRequestItem";
import { FriendRequestListProps } from "./FriendRequestList.types";

const FriendRequestList: FC<FriendRequestListProps> = (props) => {
  const { friendRequests } = props;
  const { socket } = useSocket();
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: friendRequests?.total,
  });
  const [dataSource, setDataSource] = useState<FriendRequestResponse[]>(
    friendRequests?.data
  );
  useEffect(() => {
    const handleFriendRequestNotification = (friendRequestData: any) => {
      switch (friendRequestData.action) {
        case "send":
          setDataSource((prevFriendRequests: any) => {
            const friendRequestIndex = prevFriendRequests.findIndex(
              (friendRequest: any) =>
                friendRequest.id === friendRequestData.friendRequest.id
            );
            if (friendRequestIndex !== -1) {
              return prevFriendRequests.map((friendRequest: any) => {
                if (friendRequest.id === friendRequestData.friendRequest.id) {
                  return friendRequest;
                }
                return friendRequest;
              });
            } else {
              return [...prevFriendRequests, friendRequestData.friendRequest];
            }
          });
          break;
        default:
          console.log("Unknown notification action:", friendRequestData.action);
      }
    };

    if (socket) {
      socket.on("friend-request-notification", handleFriendRequestNotification);
    }

    return () => {
      socket?.off(
        "friend-request-notification",
        handleFriendRequestNotification
      );
    };
  }, [socket]);

  return (
    <PanelContentWrapper hasSearchField height="calc(100vh - 12.25rem)">
      {/* <InfiniteScroll
          dataLength={dataSource?.length}
        //   next={fetchMoreData}
          hasMore={dataSource?.length < paginator.total}
          loader={<Loader />}
          height="calc(100vh - 12.5rem)"
        > */}
      {dataSource?.map?.((request) => (
        <FriendRequestItem key={request.id} friendRequestData={request} />
      ))}
      {/* </InfiniteScroll> */}
    </PanelContentWrapper>
  );
};
export default memo(FriendRequestList);
