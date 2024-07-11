import { motion } from "framer-motion";
import Link from "next/link";
import { memo } from "react";
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
  const vibrationKeyframes = active
    ? {
        x: [0, -2, 2, -2, 2, -2, 2, -2, 0],
        y: [0, -2, 2, -2, 2, -2, 2, -2, 0],
      }
    : {};
  return (
    <Link
      onClick={handleClick}
      href={href}
      className={`
      flex items-center justify-center
      w-full h-full
      text-sm font-semibold
      shadow-md bg-gray-900
          ${active ? "text-gold-900" : "text-gray-100"}
      transition-all duration-300 ease-in-out
    `}
    >
      <motion.div
        animate={vibrationKeyframes}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon className="h-6 w-6" />
      </motion.div>
    </Link>
  );
};

export default memo(MobileItem);
