"use client";
import { fetchFriendRequests } from "@/app/_actions/friendRequestActions/fetchFriendRequests";
import Loader from "@/app/components/loader/Loader";
import { useSocket } from "@/context/SocketContext";
import PanelContentWrapper from "@/features/panelContentWrapper/PanelContentWrapper";
import {
  FriendRequestResponse,
  FriendRequestsResponse,
} from "@/types/FriendRequest";
import { FC, memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FriendRequestItem from "../friendRequestItem/FriendRequestItem";
import { FriendRequestListProps } from "./FriendRequestList.types";

const FriendRequestList: FC<FriendRequestListProps> = (props) => {
  const { label, initialFriendRequests } = props;
  const { socket } = useSocket();

  const [dataSource, setDataSource] = useState<FriendRequestResponse[]>(
    initialFriendRequests?.data
  );
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: initialFriendRequests?.total,
  });
  const [paramToSearch, setParamToSearch] = useState<string>("");
  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newFriendRequests = (await fetchFriendRequests(
      nextPage,
      paginator.offset,
      paramToSearch
    )) as { data: FriendRequestsResponse };
    setDataSource((prevItems) => [
      ...prevItems,
      ...newFriendRequests.data.data,
    ]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };
  useEffect(() => {
    const fetchNewFriends = async () => {
      const newFriendRequests = (await fetchFriendRequests(
        1,
        paginator.offset,
        paramToSearch
      )) as { data: FriendRequestsResponse };
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newFriendRequests.data.total,
      }));
      setDataSource(newFriendRequests.data.data);
    };
    fetchNewFriends();
  }, [paramToSearch, paginator.offset]);

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
      socket.on("friend_request_notification", handleFriendRequestNotification);
    }

    return () => {
      socket?.off(
        "friend_request_notification",
        handleFriendRequestNotification
      );
    };
  }, [socket]);

  return (
    <PanelContentWrapper
      hasSearchField
      height="h-[calc(100vh-12.25rem)]"
      label={label}
      setParamToSearch={setParamToSearch}
    >
      <div id="friendRequestsContainer" className="flex-grow overflow-y-auto">
        <InfiniteScroll
          dataLength={dataSource?.length}
          next={fetchMoreData}
          hasMore={dataSource?.length < paginator.total}
          loader={<Loader />}
          scrollableTarget="friendRequestsContainer"
        >
          {dataSource?.map?.((request) => (
            <FriendRequestItem key={request.id} friendRequestData={request} />
          ))}
        </InfiniteScroll>{" "}
      </div>
    </PanelContentWrapper>
  );
};
export default memo(FriendRequestList);
