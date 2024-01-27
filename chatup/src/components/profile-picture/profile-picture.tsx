import { FC } from "react";
import { TiCamera } from "react-icons/ti";
import Avatar from "../avatar/avatar";
const ProfilePicture: FC = () => {
  return (
    <div className="group relative h-32 w-32 rounded-full">
      <Avatar additionalClasses="h-32 w-32 shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900" />
      <TiCamera className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl group-hover:block" />
    </div>
  );
};
export default ProfilePicture;
