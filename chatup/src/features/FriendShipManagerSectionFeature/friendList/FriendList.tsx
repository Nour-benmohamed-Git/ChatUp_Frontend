import { getConversationByParticipants } from "@/app/_actions/conversation-actions/get-conversation-by-participants";
import { fetchOwnFriends } from "@/app/_actions/user-actions/fetch-own-friends";

import Loader from "@/app/components/loader/loader";
import { UserResponse } from "@/types/User";
import { useRouter } from "next/navigation";
import { FC, memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FriendItem from "../friendItem/FriendItem";
import { FriendListProps } from "./FriendList.types";
import PanelContentWrapper from "@/features/panel-content-wrapper/panel-content-wrapper";


const FriendList: FC<FriendListProps> = (props) => {
  const { label, initialFriends } = props;
  const router = useRouter();
  const [dataSource, setDataSource] = useState<UserResponse[]>(
    initialFriends.data
  );
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: initialFriends.total,
  });
  const [paramToSearch, setParamToSearch] = useState<string>("");
  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newFriends = await fetchOwnFriends(
      nextPage,
      paginator.offset,
      paramToSearch
    );
    setDataSource((prevItems) => [...prevItems, ...newFriends?.data]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };
  useEffect(() => {
    const fetchNewFriends = async () => {
      const newFriends = await fetchOwnFriends(
        1,
        paginator.offset,
        paramToSearch
      );
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newFriends.total,
      }));
      setDataSource(newFriends?.data);
    };
    fetchNewFriends();
  }, [paramToSearch, paginator.offset]);

  const handleCreateNewChat = async (userId: number) => {
    try {
      const response = await getConversationByParticipants({
        secondMemberId: userId.toString(),
      });
      const conversationId = response?.data?.id || 0;
      const deletedByCurrentUser =
        response?.data?.deletedByCurrentUser || false;
      const queryParams = `deletedByCurrentUser=${deletedByCurrentUser}&secondMemberId=${userId}`;
      router.push(`/conversations/${conversationId}?${queryParams}`, {
        scroll: false,
      });
    } catch (error) {
      console.log("Error occurred:", error);
    }
  };
  return (
    <PanelContentWrapper
      hasSearchField
      height="calc(100% - 7.5rem)"
      label={label}
      setParamToSearch={setParamToSearch}
    >
      <InfiniteScroll
        dataLength={dataSource?.length}
        next={fetchMoreData}
        hasMore={dataSource?.length < paginator.total}
        loader={<Loader />}
        height="calc(100vh - 12.5rem)"
      >
        {dataSource?.map?.((user) => (
          <FriendItem
            key={user.username}
            userData={user}
            handleCreateNewChat={handleCreateNewChat}
          />
        ))}
      </InfiniteScroll>
    </PanelContentWrapper>
  );
};
export default memo(FriendList);
