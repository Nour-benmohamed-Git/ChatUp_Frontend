import { FC } from "react";
import { Controller } from "react-hook-form";
import { TiCamera } from "react-icons/ti";
import Avatar from "../avatar/avatar";
import { ProfilePictureProps } from "./profile-picture.types";
const ProfilePicture: FC<ProfilePictureProps> = ({ id, name }) => {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <label
          htmlFor={id}
          className="group relative h-32 w-32 rounded-full cursor-pointer"
        >
          <input
            id={id}
            name={name}
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange(e?.target?.files?.[0]);
            }}
            className="hidden"
          />
          <Avatar
            additionalClasses="h-32 w-32 shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
            fileName={field.value}
          />
          <TiCamera className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl group-hover:block" />
        </label>
      )}
    />
  );
};
export default ProfilePicture;
