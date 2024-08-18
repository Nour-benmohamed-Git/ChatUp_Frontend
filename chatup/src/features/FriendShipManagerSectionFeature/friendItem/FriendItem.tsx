import { blockFriend } from "@/app/_actions/friendActions/blockFriend";
import { removeFriend } from "@/app/_actions/friendActions/removeFriend";
import Avatar from "@/app/components/avatar/Avatar";
import Dialog from "@/app/components/dialog/Dialog";
import Menu from "@/app/components/menu/Menu";
import { FriendItemActions } from "@/utils/constants/actionLists/friendItemActions";
import { MenuPosition } from "@/utils/constants/globals";
import { FC, memo, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FriendItemProps } from "./FriendItem.types";

const FriendItem: FC<FriendItemProps> = (props) => {
  const { userData, handleCreateNewChat } = props;
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const openRemoveModal = () => {
    setIsRemoveDialogOpen(true);
  };
  const closeRemoveModal = () => {
    setIsRemoveDialogOpen(false);
  };
  const openBlockModal = () => {
    setIsBlockDialogOpen(true);
  };
  const closeBlockModal = () => {
    setIsBlockDialogOpen(false);
  };
  const onClickFunctions: { [key: string]: () => void } = {
    remove: openRemoveModal,
    block: openBlockModal,
  };
  const updatedFriendItemActions = FriendItemActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));
  const handleRemoveFriend = async () => {
    await removeFriend(userData.id);
    closeRemoveModal();
  };
  const handleBlockFriend = async () => {
    await blockFriend(userData.id);
    closeBlockModal();
  };
  return (
    <>
      {isRemoveDialogOpen && (
        <Dialog
          title="Remove Friend"
          onClose={closeRemoveModal}
          actions={[
            {
              label: "remove",
              onClick: handleRemoveFriend,
              category: "dismissal",
            },
          ]}
        >
          {`Are you sure you want to remove ${userData.username}?`}
        </Dialog>
      )}

      {isBlockDialogOpen && (
        <Dialog
          title="Block Friend"
          onClose={closeBlockModal}
          actions={[
            {
              label: "block",
              onClick: handleBlockFriend,
              category: "dismissal",
            },
          ]}
        >
          {`Are you sure you want to block ${userData.username}?`}
        </Dialog>
      )}
      <div
        role="button"
        onClick={() => handleCreateNewChat(userData.id)}
        className="flex items-center rounded-md gap-4 m-2 px-2 py-3 bg-gray-900 hover:bg-gray-800"
      >
        <Avatar
          additionalClasses="h-12 w-12"
          rounded="rounded-full"
          fileName={userData.profilePicture}
          userId={userData.id}
        />
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <div className="text-sm font-medium text-gold-600 truncate">
            {userData.username}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-white truncate">
              {userData?.profileInfo}
            </div>
            <Menu
              actionList={updatedFriendItemActions}
              position={MenuPosition.TOP_RIGHT}
              icon={BiDotsVerticalRounded}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(FriendItem);
