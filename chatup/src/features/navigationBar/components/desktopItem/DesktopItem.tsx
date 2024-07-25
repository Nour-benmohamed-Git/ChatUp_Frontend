import Badge from "@/app/components/badge/Badge";
import Link from "next/link";
import { memo } from "react";
import { DesktopItemProps } from "./DesktopItem.types";

const DesktopItem: React.FC<DesktopItemProps> = ({
  href,
  icon: Icon,
  active,
  count,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Badge content={count}>
      <li onClick={handleClick}>
        <Link
          href={href}
          className={` 
            flex 
            rounded-md 
            p-3 
            text-sm 
            font-semibold 
            text-gold-600 
            shadow-2xl
            ${active && "bg-gray-800"}
          `}
        >
          <Icon className="h-6 w-6 shrink-0 z-50" aria-hidden="true" />
        </Link>
      </li>
    </Badge>
  );
};

export default memo(DesktopItem);
