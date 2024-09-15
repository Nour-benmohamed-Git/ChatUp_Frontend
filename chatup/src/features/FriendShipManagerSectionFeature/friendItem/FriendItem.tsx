import { blockFriend } from "@/app/_actions/friendActions/blockFriend";
import { removeFriend } from "@/app/_actions/friendActions/removeFriend";
import Avatar from "@/app/components/avatar/Avatar";
import Dialog from "@/app/components/dialog/Dialog";
import Menu from "@/app/components/menu/Menu";
import { FriendItemActions } from "@/utils/constants/actionLists/friendItemActions";
import { MenuPosition } from "@/utils/constants/globals";
import { FC, memo, useMemo, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FriendItemProps } from "./FriendItem.types";

const FriendItem: FC<FriendItemProps> = (props) => {
  const { userData, handleCreateNewChat } = props;
  const [dialogState, setDialogState] = useState({
    remove: false,
    block: false,
  });

  const openDialog = (type: "remove" | "block") =>
    setDialogState({ ...dialogState, [type]: true });
  const closeDialog = (type: "remove" | "block") =>
    setDialogState({ ...dialogState, [type]: false });

  const onClickFunctions: { [key: string]: () => void } = {
    remove: () => openDialog("remove"),
    block: () => openDialog("block"),
  };
  const updatedFriendItemActions = useMemo(
    () =>
      FriendItemActions.map((action) => ({
        ...action,
        onClick: onClickFunctions[action.label],
      })),
    []
  );
  const handleRemoveFriend = async () => {
    await removeFriend(userData.id);
    closeDialog("remove");
  };
  const handleBlockFriend = async () => {
    await blockFriend(userData.id);
    closeDialog("block");
  };

  const handleChatClick = () => handleCreateNewChat(userData.id);

  return (
    <>
      {dialogState.remove && (
        <Dialog
          title="Remove Friend"
          onClose={() => closeDialog("remove")}
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

      {dialogState.block && (
        <Dialog
          title="Block Friend"
          onClose={() => closeDialog("block")}
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
        onClick={handleChatClick}
        className="flex items-center rounded-md gap-4 m-2 px-2 py-3 bg-gray-900 hover:bg-gray-800"
      >
        <Avatar
          additionalClasses="h-12 w-12"
          rounded={`rounded-full ${
            typeof userData.profilePicture === "string" &&
            userData.profilePicture !== ""
              ? ""
              : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
          }`}
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
