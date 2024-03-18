import { FC } from "react";
import { BiSolidMessageSquareDetail } from "react-icons/bi";

const MessagesLoader: FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <BiSolidMessageSquareDetail className="w-8 h-8 text-gold-900 mr-1 animate-pulse" />
      <BiSolidMessageSquareDetail className="w-8 h-8 text-gold-600 mr-1 animate-pulse" />
      <BiSolidMessageSquareDetail className="w-8 h-8 text-gold-300 mr-1 animate-pulse" />
    </div>
  );
};
export default MessagesLoader;
