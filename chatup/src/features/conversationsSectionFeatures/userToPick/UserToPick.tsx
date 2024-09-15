import Avatar from "@/app/components/avatar/Avatar";
import { FC, memo } from "react";
import { UserToPickProps } from "./UserToPick.types";

const UserToPick: FC<UserToPickProps> = ({
  userData,
  onCheckChange,
  isChecked,
}) => {
  return (
    <div
      role="button"
      onClick={onCheckChange}
      className="flex items-center rounded-md gap-4 my-2 px-4 py-3 bg-gray-900 hover:bg-gray-800"
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
        <div className="text-xs text-white truncate">
          {userData.profileInfo}
        </div>
      </div>
      <div className="ml-auto flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className={`h-6 w-6 border-2 border-gold-600 rounded-md appearance-none checked:bg-gold-900 checked:border-transparent transition duration-200 ease-in-out cursor-pointer`}
        />
      </div>
    </div>
  );
};

export default memo(UserToPick);
