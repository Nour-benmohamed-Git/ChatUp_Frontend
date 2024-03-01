import { fetchUsers } from "@/app/_actions/fetch-users";
import { getConversationByParticipants } from "@/app/_actions/get-conversation-by-participants";
import EndMessage from "@/components/end-message/end-message";
import Loader from "@/components/loader/loader";
import UserListItem from "@/components/user-list-item/user-list-item";
import { UserResponse } from "@/types/User";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PanelContentWrapper from "../panel-content-wrapper/panel-content-wrapper";
import { ConversationLauncherProps } from "./conversation-launcher.types";

const ConversationLauncher: FC<ConversationLauncherProps> = (props) => {
  const { label, togglePanel, initialUsers } = props;
  const router = useRouter();
  const [dataSource, setDataSource] = useState<UserResponse[]>(
    initialUsers.data
  );
  const [paginator, setPaginator] = useState({
    page: 1,
    offset: 10,
    total: initialUsers.total,
  });
  const [paramToSearch, setParamToSearch] = useState<string>("");
  const fetchMoreData = async () => {
    const nextPage = paginator.page + 1;
    const newUsers = await fetchUsers(
      nextPage,
      paginator.offset,
      paramToSearch
    );
    setDataSource((prevItems) => [...prevItems, ...newUsers?.data]);
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: nextPage,
    }));
  };
  useEffect(() => {
    const fetchNewUsers = async () => {
      const newUsers = await fetchUsers(1, paginator.offset, paramToSearch);
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        page: 1,
        total: newUsers.total,
      }));
      setDataSource(newUsers?.data);
    };
    fetchNewUsers();
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
      router.replace(`/chat/${conversationId}?${queryParams}`, {
        scroll: false,
      });
    } catch (error) {
      console.log("Error occurred:", error);
    }
    togglePanel();
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
        endMessage={<EndMessage />}
        height="calc(100vh - 8.8rem)"
      >
        {dataSource?.map?.((user) => (
          <UserListItem
            key={user.username}
            userData={user}
            handleCreateNewChat={handleCreateNewChat}
          />
        ))}
      </InfiniteScroll>
    </PanelContentWrapper>
  );
};
export default ConversationLauncher;
