import { FC, memo } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Avatar from "../avatar/avatar";
import { HeaderProps } from "./header.types";
import ConversationHeaderUserInfo from "../conversation-header-user-info/conversation-header-user-info";
import { avatarActions } from "@/utils/constants/action-lists/avatar-actions";

const Header: FC<HeaderProps> = (props) => {
  const { actions, toggleHandlers, conversationData, label, userData } = props;
  return (
    <header className="sticky top-0 bg-gray-900 shadow-lg h-16 z-40 px-4 py-2.5">
      <div className="flex items-center justify-between h-full">
        <div
          role="button"
          onClick={toggleHandlers?.[avatarActions[label]]?.togglePanel}
          className="flex flex-1 gap-4"
        >
          <Avatar
            additionalClasses="h-10 w-10"
            fileName={userData?.profilePicture}
          />
          {conversationData ? (
            <ConversationHeaderUserInfo
              username="Nour elhak benmohamed"
              lastSeen="today"
            />
          ) : null}
        </div>
        <div className="flex gap-7 h-full">
          {actions.map((action) => (
            <button
              key={action.name}
              onClick={toggleHandlers?.[action?.label as string]?.togglePanel}
            >
              <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
                {action.icon}
              </div>
            </button>
          ))}
          <button className="text-gold-900 rounded-full hover:text-gold-300">
            <BiDotsVerticalRounded size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
export default memo(Header);
