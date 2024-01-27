import Image from "next/image";
import { FC, memo } from "react";
import me from "../../../public/me.jpg";
import { AvatarProps } from "./avatar.types";
const Avatar: FC<AvatarProps> = (props) => {
  const { additionalClasses } = props;
  return (
    <div className={`${additionalClasses} rounded-full overflow-hidden`}>
      <Image
        src={me}
        alt="User profile image"
        style={{ objectFit: "cover" }}
        className="rounded-full"
        placeholder="blur"
      />
    </div>
  );
};
export default memo(Avatar);
