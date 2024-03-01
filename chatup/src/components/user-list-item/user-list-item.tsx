import { FC, memo } from "react";
import Avatar from "../avatar/avatar";
import { UserListItemProps } from "./user-list-item.types";

const UserListItem: FC<UserListItemProps> = (props) => {
  const { userData, handleCreateNewChat } = props;

  return (
    <div
      role="button"
      onClick={() => handleCreateNewChat(userData.id)}
      className="flex items-center rounded-md gap-4 m-2 px-2 py-3 bg-gray-900 hover:bg-gray-800"
    >
      <Avatar
        additionalClasses="h-12 w-12"
        fileName={userData.profilePicture}
      />
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="text-sm font-medium text-gold-600 truncate">
          {userData.username}
        </div>
        <div className="text-xs text-white truncate">
          {userData?.profileInfo}
        </div>
      </div>
    </div>
  );
};
export default memo(UserListItem);
