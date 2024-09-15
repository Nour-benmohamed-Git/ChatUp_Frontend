import { getUserById } from "@/app/_actions/userActions/getUserById";
import Avatar from "@/app/components/avatar/Avatar";
import { UserResponse } from "@/types/User";
import { FC, memo, useLayoutEffect, useState } from "react";
import { ReactionItemProps } from "./ReactionItem.types";

const ReactionItem: FC<ReactionItemProps> = ({ userId, emoji }) => {
  const [senderData, setSenderData] = useState<UserResponse>();
  const getSenderData = async () => {
    const user = await getUserById(userId);
    setSenderData(user.data?.data);
  };

  useLayoutEffect(() => {
    getSenderData();
  }, []);

  return (
    <div
      role="button"
      //   onClick={removeReaction}
      className="flex items-center rounded-md gap-4 my-2 px-4 py-3 bg-gray-900 hover:bg-gray-800"
    >
      <Avatar
        additionalClasses="h-12 w-12"
        rounded={`rounded-full ${
          typeof senderData?.profilePicture === "string" &&
          senderData?.profilePicture !== ""
            ? ""
            : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
        }`}
        fileName={senderData?.profilePicture}
        userId={senderData?.id}
      />
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="text-sm font-medium text-gold-600 truncate">
          {senderData?.username}
        </div>
        <div className="text-xs text-white truncate">Click to remove</div>
      </div>
      <div className="ml-auto flex items-center text-2xl">{emoji}</div>
    </div>
  );
};

export default memo(ReactionItem);
