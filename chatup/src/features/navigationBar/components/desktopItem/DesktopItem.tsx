import Link from "next/link";
import { memo } from "react";
import { DesktopItemProps } from "./DesktopItem.types";

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick} key={label}>
      <Link
        href={href}
        className={` 
            flex 
            rounded-md 
            p-3 
            text-sm 
            font-semibold 
            text-gold-600 hover:bg-gray-800 shadow-2xl
            ${active && "bg-gray-800"}
            transition-all duration-300 ease-in-out
          `}
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
      </Link>
    </li>
  );
};

export default memo(DesktopItem);
