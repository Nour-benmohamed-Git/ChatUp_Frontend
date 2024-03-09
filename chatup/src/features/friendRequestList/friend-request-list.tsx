"use client";
import FriendRequestListItem from "@/components/friend-request-list-item/friend-request-list-item";
import { useSocket } from "@/context/socket-context";
import { NotificationResponse } from "@/types/Notification";
import { FC, memo, useEffect, useState } from "react";
import PanelContentWrapper from "../panel-content-wrapper/panel-content-wrapper";
import { FriendRequestListProps } from "./friend-request-list.types";

const FriendRequestList: FC<FriendRequestListProps> = (props) => {
  const { friendRequests } = props;
  const { socket } = useSocket();
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: friendRequests?.total,
  });
  const [dataSource, setDataSource] = useState<NotificationResponse[]>(
    friendRequests?.data
  );
  useEffect(() => {
    socket?.on("friend-request-notification", (data) => {
      console.log("New friend request:", data);
    });
  }, [socket]);
  return (
    <div className="flex flex-col bg-gradient-to-r from-black via-gray-900 to-gray-700 order-2 lg:col-span-2 lg:order-1 md:border-r md:border-slate-500 p-2">
      <h2 className="text-sm font-semibold text-gray-400 mx-2">{`Friend requests (${friendRequests?.total})`}</h2>
      <PanelContentWrapper hasSearchField height="calc(100% - 7.5rem)">
        {/* <InfiniteScroll
          dataLength={dataSource?.length}
        //   next={fetchMoreData}
          hasMore={dataSource?.length < paginator.total}
          loader={<Loader />}
          height="calc(100vh - 12.5rem)"
        > */}
        {dataSource?.map?.((request) => (
          <FriendRequestListItem key={request.id} friendRequestData={request} />
        ))}
        {/* </InfiniteScroll> */}
      </PanelContentWrapper>
    </div>
  );
};
export default memo(FriendRequestList);
