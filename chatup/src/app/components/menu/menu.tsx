import { memo, useRef, useState } from "react";
import PositionedWrapper from "../positionedWrapper/PositionedWrapper";
import { MenuProps } from "./Menu.types";

const Menu: React.FC<MenuProps> = ({ actionList, position, icon: Icon }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = (
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event?.preventDefault();
    event?.stopPropagation();
    setOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setOpenMenu(false);
  };
  return (
    <>
      <div
        ref={buttonRef}
        role="button"
        onClick={handleOpenMenu}
        className="flex justify-center items-center text-gold-900"
      >
        <Icon size={24} />
      </div>
      <PositionedWrapper
        isOpen={openMenu}
        onClose={handleCloseMenu}
        buttonRef={buttonRef}
        position={position}
      >
        <ul className="flex flex-col gap-4 bg-gray-800 p-4 rounded-md">
          {actionList.map((item) => (
            <li
              key={item.label}
              role="button"
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                handleCloseMenu();
                item.onClick();
              }}
              className="flex items-center gap-4 text-white rounded-full hover:text-gold-900 text-sm"
            >
              <div>{item.icon}</div>
              <div>{item.name}</div>
            </li>
          ))}
        </ul>
      </PositionedWrapper>
    </>
  );
};

export default memo(Menu);
