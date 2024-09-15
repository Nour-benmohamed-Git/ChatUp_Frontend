import { FC, memo } from "react";
import Avatar from "../avatar/Avatar";
import { SystemMessageProps } from "./SystemMessage.types";
import { IoInformationCircle } from "react-icons/io5";
import { MdPersonAddAlt1 } from "react-icons/md";

const SystemMessage: FC<SystemMessageProps> = ({
  combinedData,
  onViewInfo,
  onAddMembers,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-6 md:p-4">
      <div className="bg-white rounded-xl shadow-xl p-4 flex flex-col items-center justify-center w-full md:w-2/3 gap-2">
        {typeof combinedData.image === "string" ? (
          <Avatar
            additionalClasses="h-24 w-24"
            rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
            fileName={combinedData.image}
          />
        ) : Array.isArray(combinedData.image) &&
          combinedData.image.length === 1 ? (
          <div className="relative">
            {[combinedData.image[0], ""].map((image, index) => (
              <Avatar
                key={index}
                additionalClasses={`h-16 w-16 absolute ${
                  index === 0 ? "top-3 left-6" : "-top-6 right-3"
                }`}
                rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                fileName={image}
              />
            ))}
          </div>
        ) : (
          combinedData?.image
            ?.slice(0, 2)
            .map((image, index) => (
              <Avatar
                key={index}
                additionalClasses={`h-16 w-16 absolute ${
                  index === 0 ? "top-3 left-6" : "-top-6 right-3"
                }`}
                rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
                fileName={image}
              />
            ))
        )}

        <h3 className="text-xl font-semibold text-gray-900">
          {combinedData.title}
        </h3>
        <p className="text-sm text-center max-w-[24.5rem]">{combinedData.description}</p>
        <p className="text-gold-900">{combinedData?.subTitle}</p>
        <div className="flex flex-wrap flex-col md:flex-row gap-4 w-full">
          <button
            onClick={onViewInfo}
            className="flex flex-1 text-xs md:text-sm items-center font-medium justify-center gap-2 text-gold-900 px-4 md:px-6 py-2 rounded-md border border-gray-700 hover:bg-gold-100 w-full"
          >
            <IoInformationCircle className="text-gold-900 h-6 w-6" />
            Group Info
          </button>
          <button
            onClick={onAddMembers}
            className="flex flex-1 text-xs md:text-sm items-center font-medium justify-center gap-2 text-gold-900 px-4 md:px-6 py-2 rounded-md border border-gray-700 hover:bg-gold-100 w-full"
          >
            <MdPersonAddAlt1 className="text-gold-900 h-6 w-6" />
            Add Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(SystemMessage);
