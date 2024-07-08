import Avatar from "@/app/components/avatar/Avatar";
import Link from "next/link";
import { FC, memo } from "react";
import { MobileProfileItemProps } from "./MobileProfileItem.types";

const MobileProfileItem: FC<MobileProfileItemProps> = ({ profilePicture }) => {
  return (
    <Link
      href={"/profile"}
      className="absolute bottom-1 flex items-center justify-center h-20 w-20 rounded-full text-white shadow-2xl z-10 overflow-hidden"
    >
      <div className="absolute bottom-0 h-9 w-full bg-slate-700" />
      <Avatar
        additionalClasses="h-16 w-16 rounded-full border-2 border-gold-600"
        fileName={profilePicture}
      />
    </Link>
  );
};

export default memo(MobileProfileItem);
