import { avatarActions } from "@/utils/constants/action-lists/avatarActions";
import { useRouter } from "next/navigation";
import { FC, memo, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";
import Avatar from "../avatar/avatar";
import ConversationHeaderUserInfo from "../conversation-header-user-info/conversation-header-user-info";
import Menu from "../menu/menu";
import { MenuPosition } from "../menu/menu.types";
import { HeaderProps } from "./header.types";

const Header: FC<HeaderProps> = (props) => {
  const { actions, toggleHandlers, label, userData, menuActionList,title } = props;
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const handleOpenMenu = () => {
    setIsOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setIsOpenMenu(false);
  };
  return (
    <header className="sticky top-0 bg-gray-900 shadow-lg h-16 z-40 px-4 py-2.5 rounded-b-md">
      <div className="flex items-center justify-between h-full gap-2">
        {label === "right_container" ? (
          <button
            onClick={() => router.back()}
            className="text-gold-900 rounded-full hover:text-gold-300 md:hidden"
          >
            <IoMdArrowRoundBack className="text-2xl" />
          </button>
        ) : null}
        {label === "right_container" && userData?.username ? (
          <div
            role="button"
            onClick={toggleHandlers?.[avatarActions[label]]?.togglePanel}
            className="flex flex-1 gap-4"
          >
            <Avatar
              additionalClasses="h-10 w-10 rounded-full"
              fileName={userData?.profilePicture}
            />

            <ConversationHeaderUserInfo
              username={userData?.username}
              lastSeen="today"
            />
          </div>
        ) : (
          <h1 className="text-gold-900 text-xl font-bold ml-2">{title}</h1>
        )}
        <div className="flex gap-7 h-full">
          {actions?.map((action) => (
            <button
              key={action.name}
              onClick={toggleHandlers?.[action?.label as string]?.togglePanel}
            >
              <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
                {action.icon}
              </div>
            </button>
          ))}
          <div
            ref={buttonRef}
            role="button"
            onClick={handleOpenMenu}
            className="flex justify-center items-center text-gold-900 rounded-full hover:text-gold-300"
          >
            <BiDotsVerticalRounded size={20} />
          </div>
          {/* <button   className="text-gold-900 rounded-full hover:text-gold-300">
            <BiDotsVerticalRounded size={24} />
          </button>  */}
          <Menu
            actionList={menuActionList}
            isOpen={isOpenMenu}
            onClose={handleCloseMenu}
            buttonRef={buttonRef}
            position={MenuPosition.BOTTOM_LEFT}
          />
        </div>
      </div>
    </header>
  );
};
export default memo(Header);
