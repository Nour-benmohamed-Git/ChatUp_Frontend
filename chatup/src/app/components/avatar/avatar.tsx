import environment from "@/utils/config/environment";
import Image from "next/image";
import { FC, memo, useEffect, useState } from "react";
import avatar from "../../../../public/avatar.svg";
import { AvatarProps } from "./Avatar.types";

const Avatar: FC<AvatarProps> = (props) => {
  const { additionalClasses, fileName } = props;
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

  return (
    <div className={`${additionalClasses}  overflow-hidden relative`}>
      <Image
        src={
          typeof fileName === "string"
            ? `${environment.baseUrl}/uploads/${fileName}`
            : avatar
        }
        alt="image"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        fill
        {...(imageBlur
          ? {
              placeholder: "blur",
              blurDataURL: imageBlur,
            }
          : {})}
      />
    </div>
  );
};
export default memo(Avatar);
