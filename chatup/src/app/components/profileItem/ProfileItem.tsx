import { FC, memo } from "react";
import { ProfileItemProps } from "./ProfileItem.types";

const ProfileItem: FC<ProfileItemProps> = (props) => {
  const { icon, value } = props;
  return (
    <div className="flex items-center justify-between min-w-0 bg-gray-900 rounded-md px-2 py-3 w-full">
      <div className="flex items-center rounded-md text-gold-900 mr-4">
        {icon}
      </div>
      <div className="text-xs text-white truncate">{value}</div>
    </div>
  );
};
export default memo(ProfileItem);
