import Link from "next/link";
import { MobileItemProps } from "./MobileItem.types";

const MobileItem: React.FC<MobileItemProps> = ({
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
    <Link
      onClick={handleClick}
      href={href}
      className={`
      flex
      justify-center
      w-full
      p-5
      text-sm 
      font-semibold 
      text-gold-600 hover:bg-gray-800 shadow-2xl
      ${active && "bg-gray-800"}
      transition-all duration-300 ease-in-out
      `}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default MobileItem;
