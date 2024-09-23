import { useAudioCall } from "@/context/AudioCallContext";
import { avatarActions } from "@/utils/constants/actionLists/avatarActions";
import { ChatSessionType, MenuPosition } from "@/utils/constants/globals";
import { FC, memo } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdCall } from "react-icons/md";
import Avatar from "../avatar/Avatar";
import ConversationHeaderUserInfo from "../conversationHeaderUserInfo/ConversationHeaderUserInfo";
import Menu from "../menu/Menu";
import { HeaderProps } from "./Header.types";

const Header: FC<HeaderProps> = (props) => {
  const {
    actions,
    toggleHandlers,
    label,
    combinedData,
    menuActionList,
    title,
    handleBack,
  } = props;
  const { startCall } = useAudioCall();

  return (
    <header className="sticky top-0 bg-gray-900 shadow-lg h-16 z-40 px-4 py-2.5">
      <div className="flex items-center justify-between h-full">
        <div className="flex gap-1">
          {label && (
            <button
              onClick={handleBack}
              className={`text-gold-900 rounded-full hover:text-gold-300 ${
                label === "selected_conversation" ? "md:hidden" : "bloc"
              }`}
            >
              <IoMdArrowRoundBack className="text-2xl" />
            </button>
          )}
          {label && combinedData?.title ? (
            <div
              role="button"
              onClick={toggleHandlers?.[avatarActions[label]]?.togglePanel}
              className="flex flex-1 gap-4"
            >
              <div className="flex-shrink-0">
                {combinedData.type === ChatSessionType.GROUP ? (
                  <div className="relative h-10 w-10">
                    {typeof combinedData.image === "string" ? (
                      <Avatar
                        additionalClasses="h-10 w-10"
                        rounded="rounded-full"
                        fileName={combinedData.image as string}
                      />
                    ) : combinedData?.image?.length === 1 ? (
                      [combinedData.image[0], ""].map((image, index) => (
                        <Avatar
                          key={index}
                          additionalClasses={`h-7 w-7 absolute ${
                            index === 0 ? "top-0 left-3" : "-top-3 right-0"
                          }`}
                          rounded={`rounded-full ${
                            typeof image === "string" && image !== ""
                              ? ""
                              : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                          }`}
                          fileName={image}
                        />
                      ))
                    ) : (
                      combinedData?.image
                        ?.slice(0, 2)
                        .map((image, index) => (
                          <Avatar
                            key={index}
                            additionalClasses={`h-7 w-7 absolute ${
                              index === 0 ? "top-0 left-3" : "-top-3 right-0"
                            }`}
                            rounded={`rounded-full ${
                              typeof image === "string" && image !== ""
                                ? ""
                                : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                            }`}
                            fileName={image}
                          />
                        ))
                    )}
                  </div>
                ) : (
                  <Avatar
                    additionalClasses="h-10 w-10"
                    rounded={`rounded-full ${
                      typeof combinedData?.image === "string" &&
                      combinedData?.image !== ""
                        ? ""
                        : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                    }`}
                    fileName={combinedData?.image as string}
                    userId={combinedData.additionalInfo as number}
                  />
                )}
              </div>
              <ConversationHeaderUserInfo
                username={combinedData?.title}
                additionalInfo={combinedData.additionalInfo}
              />
            </div>
          ) : (
            <h1 className="text-gold-900 text-xl font-bold ml-2">{title}</h1>
          )}
        </div>
        <div className="flex gap-7 h-full">
          {label === "selected_conversation" && (
            <button onClick={() => startCall(combinedData)}>
              <div className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300">
                <MdCall size={24} />
              </div>
            </button>
          )}
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
