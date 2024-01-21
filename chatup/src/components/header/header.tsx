import { FC, memo } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Avatar from "../avatar/avatar";
import { HeaderProps } from "./header.types";

const Header: FC<HeaderProps> = (props) => {
  const { actions } = props;
  return (
    <header className="sticky top-0 bg-gray-900 shadow-lg h-16 z-50 px-4 py-2.5">
      <div className="flex items-center justify-between h-full">
        <Avatar sizeClass="h-10 w-10"/>
        <div className="flex gap-7 h-full">
          {actions.map((action) => (
            <button key={action.name}>
              <div className="flex justify-center items-center rounded-md text-gold-900  hover:text-gold-50">
                {action.icon}
              </div>
            </button>
          ))}
          <button className="text-gold-900 rounded-full hover:text-gold-50">
            <BiDotsVerticalRounded size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
export default memo(Header);
