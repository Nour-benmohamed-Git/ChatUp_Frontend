import { avatarActions } from "@/utils/constants/actionLists/avatarActions";
import { useRouter } from "next/navigation";
import { FC, memo } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";
import Avatar from "../avatar/Avatar";
import ConversationHeaderUserInfo from "../conversationHeaderUserInfo/ConversationHeaderUserInfo";
import Menu from "../menu/Menu";

import { MenuPosition } from "@/utils/constants/globals";
import { HeaderProps } from "./Header.types";

const Header: FC<HeaderProps> = (props) => {
  const { actions, toggleHandlers, label, userData, menuActionList, title } =
    props;
  const router = useRouter();
  const handleBack = () => {
    router.push("/conversations");
  };
  return (
    <header className="sticky top-0 bg-gray-900 shadow-lg h-16 z-40 px-4 py-2.5">
      <div className="flex items-center justify-between h-full gap-2">
        {label === "right_container" ? (
          <button
            onClick={handleBack}
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
              additionalClasses="h-10 w-10"
              rounded="rounded-full"
              fileName={userData?.profilePicture}
              userId={userData.id}
            />
            <ConversationHeaderUserInfo
              username={userData?.username}
              userId={userData.id}
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
          <Menu
            actionList={menuActionList}
            position={MenuPosition.BOTTOM_LEFT}
            icon={BiDotsVerticalRounded}
          />
        </div>
      </div>
    </header>
  );
};
export default memo(Header);
