import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import NoDataFound from "@/components/no-data-found/no-data-found";
import { useGetUsersQuery } from "@/redux/apis/user/userApi";
import { FC } from "react";
import PanelContentWrapper from "../panel-content-wrapper/panel-content-wrapper";
import { MultiConversationLauncherProps } from "./multi-conversation-launcher.types";

const MultiConversationLauncher: FC<MultiConversationLauncherProps> = (
  props
) => {
  const { label, togglePanel } = props;
  const { data, isLoading, error } = useGetUsersQuery();

  let content = null;
  if (isLoading) {
    content = <Loader />;
  }
  if (error) {
    content = <ErrorBox error={error} />;
  }
  if (data?.data?.length === 0) {
    content = <NoDataFound message="No data found" />;
  }
  content = data?.data?.map?.((user) => (
    <h1 key={user.email}>{user.email}</h1>
    // <UserListItem key={user.username} userData={user} handleSelectChatItem={}/>
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
export default MultiConversationLauncher;
