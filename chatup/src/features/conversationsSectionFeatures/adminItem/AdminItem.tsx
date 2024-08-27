import { getUserById } from "@/app/_actions/userActions/getUserById";
import Avatar from "@/app/components/avatar/Avatar";
import { UserResponse } from "@/types/User";
import { FC, memo, useLayoutEffect, useState } from "react";
import { AdminItemProps } from "./AdminItem.types";
import { getItem } from "@/utils/helpers/cookiesHelpers";
import { globals } from "@/utils/constants/globals";

const AdminItem: FC<AdminItemProps> = ({ userId, isAdmin }) => {
  const [senderData, setSenderData] = useState<UserResponse>();
  const getSenderData = async () => {
    const user = await getUserById(userId);
    setSenderData(user.data?.data);
  };

  useLayoutEffect(() => {
    getSenderData();
  }, []);
  const currentUserId = getItem(globals.currentUserId);

  return (
    <div
      role="button"
      //   onClick={removeReaction}
      className="flex items-center gap-4 md:gap-6 hover:bg-gradient-to-r from-slate-500 to-slate-600 px-4 md:px-8 py-3"
    >
      <Avatar
        additionalClasses="h-10 w-10"
        rounded="rounded-full"
        fileName={senderData?.profilePicture}
        userId={senderData?.id}
      />
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gold-600 max-w-[calc(100%-3rem)] truncate">
            {userId === currentUserId ? "You" : senderData?.username}
          </div>
          {isAdmin && (
            <div className="text-xs rounded-md p-1 bg-gold-400 ml-2 truncate flex-shrink-0">
              Admin
            </div>
          )}
        </div>
        <div className="text-xs text-white truncate">
          {senderData?.profileInfo}
        </div>
      </div>
    </div>
  );
};

export default memo(AdminItem);
