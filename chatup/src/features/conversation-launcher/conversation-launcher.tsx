import EndMessage from "@/components/end-message/end-message";
import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import NoDataFound from "@/components/no-data-found/no-data-found";
import UserListItem from "@/components/user-list-item/user-list-item";
import { useGetChatSessionByParticipantsMutation } from "@/redux/apis/chat-sessions/chatSessionsApi";
import { useGetUsersQuery } from "@/redux/apis/user/userApi";
import { UserResponse } from "@/types/User";
import { FC, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PanelContentWrapper from "../panel-content-wrapper/panel-content-wrapper";
import { ConversationLauncherProps } from "./conversation-launcher.types";

const ConversationLauncher: FC<ConversationLauncherProps> = (props) => {
  const { label, handleSelectChatItem, togglePanel } = props;
  const [dataSource, setDataSource] = useState<UserResponse[]>([]);
  const [paginator, setPaginator] = useState({ page: 1, offset: 10, total: 0 });
  const [paramToSearch, setParamToSearch] = useState<string>("");

  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useGetUsersQuery({
    page: paginator.page,
    offset: paginator.offset,
    search: paramToSearch,
  });
  const fetchMoreData = () => {
    setPaginator((prevPaginator) => ({
      ...prevPaginator,
      page: prevPaginator.page + 1,
    }));
  };
  const [getChatSessionByParticipants] =
    useGetChatSessionByParticipantsMutation();
  const handleCreateNewChat = (userId: number) => {
    getChatSessionByParticipants({ secondMemberId: userId })
      .unwrap()
      .then((response) => {
        if (response.data) {
          handleSelectChatItem({
            chatId: response.data.id,
            secondMemberId: userId,
            deletedByCurrentUser: response.data.deletedByCurrentUser,
          });
        } else {
          handleSelectChatItem({
            chatId: 0,
            secondMemberId: userId,
          });
        }
      })
      .catch((_error) => {
        console.log("_error", _error);
      });
    togglePanel();
  };

  useEffect(() => {
    if (users?.total) {
      setPaginator((prevPaginator) => ({
        ...prevPaginator,
        total: users?.total,
      }));
    }
  }, [users?.total]);

  // useEffect(() => {
  //   if (users?.data) {
  //     setDataSource(users?.data);
  //   }
  // }, [users?.data]);
  useEffect(() => {
    if (users?.data) {
      setDataSource((prevItems) => [...prevItems, ...users?.data]);
    }
  }, [users?.data]);
  let content = null;
  if (isLoadingUsers) {
    content = <Loader />;
  } else if (usersError) {
    content = <ErrorBox error={usersError} />;
  } else if (dataSource?.length === 0) {
    content = <NoDataFound message="No data found" />;
  } else
    content = (
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
    );

  return (
    <PanelContentWrapper
      hasSearchField
      height="calc(100% - 7.5rem)"
      label={label}
      setParamToSearch={setParamToSearch}
    >
      {content}
    </PanelContentWrapper>
  );
};
export default ConversationLauncher;
