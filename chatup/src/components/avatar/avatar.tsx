import Image from "next/image";
import { FC, memo } from "react";
import me from "../../../public/me.jpg";
import { AvatarProps } from "./avatar.types";
import environment from "@/utils/config/environment";
const Avatar: FC<AvatarProps> = (props) => {
  const { additionalClasses,fileName } = props;
  return (
    <div className={`${additionalClasses} rounded-full overflow-hidden`}>
      <Image
        // src="http://localhost:3333/uploads/1707789148719-me3.jpg"
        src={`${environment.baseUrl}/uploads/${fileName}`}
        alt="User profile image"
        style={{ objectFit: "cover" }}
        className="rounded-full"
        width={500}
        height={500}
      />
    </div>
  );
};
export default memo(Avatar);
