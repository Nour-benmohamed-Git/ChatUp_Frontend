import Avatar from "@/app/components/avatar/avatar";
import { FC, memo } from "react";
import { FriendItemProps } from "./FriendItem.types";

const FriendItem: FC<FriendItemProps> = (props) => {
  const { userData, handleCreateNewChat } = props;

  return (
    <div
      role="button"
      onClick={() => handleCreateNewChat(userData.id)}
      className="flex items-center rounded-md gap-4 m-2 px-2 py-3 bg-gray-900 hover:bg-gray-800"
    >
      <Avatar
        additionalClasses="h-12 w-12 rounded-full"
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
export default memo(FriendItem);
