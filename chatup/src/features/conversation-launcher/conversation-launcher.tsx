import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import NoDataFound from "@/components/no-data-found/no-data-found";
import UserListItem from "@/components/user-list-item/user-list-item";
import { useGetChatSessionByParticipantsMutation } from "@/redux/apis/chat-sessions/chatSessionsApi";
import { useGetUsersQuery } from "@/redux/apis/user/userApi";
import { FC } from "react";
import PanelContentWrapper from "../panel-content-wrapper/panel-content-wrapper";
import { ConversationLauncherProps } from "./conversation-launcher.types";

const ConversationLauncher: FC<ConversationLauncherProps> = (props) => {
  const { label, handleSelectChatItem, togglePanel } = props;
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useGetUsersQuery();
  const [getChatSessionByParticipants] =
    useGetChatSessionByParticipantsMutation();
  const handleCreateNewChat = (userId: number) => {
    getChatSessionByParticipants({ secondMemberId: userId })
      .unwrap()
      .then((response) => {
        handleSelectChatItem({
          chatId: response.data.id,
          secondMemberId: userId,
        });
      })
      .catch((_error) => {
        handleSelectChatItem({ chatId: 0, secondMemberId: userId });
      });
    togglePanel();
  };
  let content = null;
  if (isLoadingUsers) {
    content = <Loader />;
  }

  if (usersError) {
    content = <ErrorBox error={usersError} />;
  }

  if (users?.data?.length === 0) {
    content = <NoDataFound message="No data found" />;
  }
  content = users?.data?.map?.((user) => (
    <UserListItem
      key={user.username}
      userData={user}
      handleCreateNewChat={handleCreateNewChat}
    />
  ));

  return (
    <PanelContentWrapper
      hasSearchField
      height="calc(100% - 7.5rem)"
      label={label}
    >
      {content}
    </PanelContentWrapper>
  );
};
export default ConversationLauncher;
