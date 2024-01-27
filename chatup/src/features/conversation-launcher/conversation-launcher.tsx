import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import NoDataFound from "@/components/no-data-found/no-data-found";
import UserListItem from "@/components/user-list-item/user-list-item";
import { useGetUsersQuery } from "@/redux/apis/user/userApi";
import { FC } from "react";
import PanelContentWrapper from "../panel-content-wrapper/panel-content-wrapper";
import { ConversationLauncherProps } from "./conversation-launcher.types";

const ConversationLauncher: FC<ConversationLauncherProps> = (props) => {
  const { label } = props;
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
    <UserListItem key={user.username} userData={user} />
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
