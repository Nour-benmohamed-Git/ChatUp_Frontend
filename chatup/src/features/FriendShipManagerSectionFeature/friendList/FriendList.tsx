import { getConversationByParticipants } from "@/app/_actions/conversationActions/getConversationByParticipants";
import { fetchFriends } from "@/app/_actions/friendActions/fetchFriends";

import Loader from "@/app/components/loader/Loader";
import PanelContentWrapper from "@/features/panelContentWrapper/PanelContentWrapper";
import { ConversationResponse } from "@/types/ChatSession";
import { UserResponse, UsersResponse } from "@/types/User";
import { useRouter } from "next/navigation";
import { FC, memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FriendItem from "../friendItem/FriendItem";
import { FriendListProps } from "./FriendList.types";

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
    const newFriends = (await fetchFriends(
      nextPage,
      paginator.offset,
      paramToSearch
    )) as { data: UsersResponse };
    setDataSource((prevItems) => [...prevItems, ...newFriends.data.data]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };
  useEffect(() => {
    const fetchNewFriends = async () => {
      const newFriends = (await fetchFriends(
        1,
        paginator.offset,
        paramToSearch
      )) as { data: UsersResponse };
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newFriends.data.total,
      }));
      setDataSource(newFriends.data.data);
    };
    fetchNewFriends();
  }, [paramToSearch, paginator.offset]);

  const handleCreateNewChat = async (userId: number) => {
    try {
      const response = (await getConversationByParticipants({
        secondMemberId: userId,
      })) as { data: { data: ConversationResponse } };
      const conversationId = response.data.data?.id || "new";
      const queryParams = `secondMemberId=${userId}`;
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
      height="h-[calc(100vh-12.25rem)]"
      label={label}
      setParamToSearch={setParamToSearch}
    >
      <div id="friendsContainer" className="flex-grow overflow-y-auto">
        <InfiniteScroll
          dataLength={dataSource?.length}
          next={fetchMoreData}
          hasMore={dataSource?.length < paginator.total}
          loader={<Loader />}
          scrollableTarget="friendsContainer"
        >
          {dataSource?.map?.((user) => (
            <FriendItem
              key={user.username}
              userData={user}
              handleCreateNewChat={handleCreateNewChat}
            />
          ))}
        </InfiniteScroll>
      </div>
    </PanelContentWrapper>
  );
};
export default memo(FriendList);
