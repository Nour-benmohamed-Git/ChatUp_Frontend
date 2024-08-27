import { avatarActions } from "@/utils/constants/actionLists/avatarActions";
import { ChatSessionType, MenuPosition } from "@/utils/constants/globals";
import { useRouter } from "next/navigation";
import { FC, memo } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";
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
  } = props;
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
        {label === "right_container" && combinedData?.title ? (
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
                        rounded="rounded-full"
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
                          rounded="rounded-full"
                          fileName={image}
                        />
                      ))
                  )}
                </div>
              ) : (
                <Avatar
                  additionalClasses="h-10 w-10"
                  rounded="rounded-full"
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
