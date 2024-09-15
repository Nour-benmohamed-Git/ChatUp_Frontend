import Avatar from "@/app/components/avatar/Avatar";
import { ChatSessionType } from "@/utils/constants/globals";
import { FC, memo } from "react";
import { ConversationToPickProps } from "./ConversationToPick.types";

const ConversationToPick: FC<ConversationToPickProps> = ({
  conversation,
  onCheckChange,
  isChecked,
}) => {
  return (
    <div
      role="button"
      onClick={onCheckChange}
      className="flex items-center rounded-md gap-4 my-2 px-4 py-3 bg-gray-900 hover:bg-gray-800"
    >
       <div className="flex-shrink-0">
          {conversation.type === ChatSessionType.GROUP ? (
            <div className="relative h-12 w-12">
              {typeof conversation.image === "string" ? (
                <Avatar
                  additionalClasses="h-12 w-12"
                  rounded="rounded-full"
                  fileName={conversation.image as string}
                />
              ) : conversation?.image?.length === 1 ? (
                [conversation.image[0], ""].map((image, index) => (
                  <Avatar
                    key={index}
                    additionalClasses={`h-8 w-8 absolute ${
                      index === 0 ? "top-0 left-4" : "-top-4 right-0"
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
                conversation?.image
                  ?.slice(0, 2)
                  .map((image, index) => (
                    <Avatar
                      key={index}
                      additionalClasses={`h-8 w-8 absolute ${
                        index === 0 ? "top-0 left-4" : "-top-4 right-0"
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
              additionalClasses="h-12 w-12"
              rounded={`rounded-full ${
                typeof conversation.image === "string" &&
                conversation.image !== ""
                  ? ""
                  : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
              }`}
              fileName={conversation.image as string}
             
            />
          )}
        </div>
      {/* <Avatar
        additionalClasses="h-12 w-12"
        rounded="rounded-full"
        fileName={conversation.image}
        userId={conversation.id}
      /> */}
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="text-sm font-medium text-gold-600 truncate">
          {conversation.title}
        </div>
        <div className="text-xs text-white truncate">
          {/* {userData.profileInfo} */}
          azdzadzazdd
        </div>
      </div>
      <div className="ml-auto flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className={`h-6 w-6 border-2 border-gold-600 rounded-md appearance-none checked:bg-gold-900 checked:border-transparent transition duration-200 ease-in-out cursor-pointer`}
        />
      </div>
    </div>
  );
};

export default memo(ConversationToPick);
