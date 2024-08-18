import Image from "next/image";
import { FC, memo, useState } from "react";
import { Controller } from "react-hook-form";
import { TiCamera } from "react-icons/ti";
import Avatar from "../avatar/Avatar";
import { ProfilePictureProps } from "./ProfilePicture.types";
const ProfilePicture: FC<ProfilePictureProps> = ({ id, name }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
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
              handleImageChange(e);
              field.onChange(e?.target?.files?.[0]);
            }}
            className="hidden"
          />
          {previewUrl ? (
            <div className="h-32 w-32 shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900 rounded-full overflow-hidden relative">
              <Image
                src={previewUrl}
                alt="Selected profile image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                fill
              />
            </div>
          ) : (
            <Avatar
              additionalClasses="h-32 w-32"
              rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
              fileName={field.value}
            />
          )}
          <TiCamera className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl group-hover:block" />
        </label>
      )}
    />
  );
};
export default memo(ProfilePicture);
