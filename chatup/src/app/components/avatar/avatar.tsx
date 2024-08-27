import { useOnlineUsers } from "@/context/OnlineUsersContext";
import environment from "@/utils/config/environment";
import Image from "next/image";
import { FC, memo, useEffect, useState } from "react";
import avatar from "../../../../public/avatar.svg";
import { AvatarProps } from "./Avatar.types";

const Avatar: FC<AvatarProps> = (props) => {
  const { additionalClasses, rounded = "rounded-md", fileName, userId } = props;
  const { onlineUsers } = useOnlineUsers();
  const [imageBlur, setImageBlur] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageBlur = async () => {
      try {
        const response = await fetch(
          `${environment.baseUrl}/uploads/${fileName}`
        );
        const buffer = await response.arrayBuffer();
        const base64String = Buffer.from(buffer).toString("base64");
        setImageBlur(`data:image/png;base64,${base64String}`);
      } catch (error) {
        console.error("Error fetching image blur:", error);
      }
    };
    if (typeof fileName === "string") {
      fetchImageBlur();
    }
  }, [fileName]);

  const isOnline = onlineUsers.indexOf(userId as number) !== -1;
  return (
    <div className={`relative ${additionalClasses}`}>
      <div className={`relative w-full h-full overflow-hidden ${rounded}`}>
        <Image
          src={
            typeof fileName === "string" && fileName !== ""
              ? `${environment.baseUrl}/uploads/${fileName}`
              : avatar
          }
          alt="image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full"
          fill
          {...(imageBlur
            ? {
                placeholder: "blur",
                blurDataURL: imageBlur,
              }
            : {})}
        />
      </div>
      {userId && (
        <span
          className={`absolute rounded-full bottom-1.5 right-1.5 transform translate-x-1/2 translate-y-1/2 ring-2 ring-white h-2 w-2 z-50 ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      )}
    </div>
  );
};
export default memo(Avatar);
