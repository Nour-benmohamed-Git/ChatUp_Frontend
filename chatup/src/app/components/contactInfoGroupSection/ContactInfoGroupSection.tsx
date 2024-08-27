import AdminItem from "@/features/conversationsSectionFeatures/adminItem/AdminItem";
import { ChatSessionType } from "@/utils/constants/globals";
import { FC, memo } from "react";
import { FaUsers } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import { ContactInfoGroupSectionProps } from "./ContactInfoGroupSection.types";

const ContactInfoGroupSection: FC<ContactInfoGroupSectionProps> = ({
  combinedData,
}) => {
  return combinedData.type === ChatSessionType.INDIVIDUAL ? (
    <div className="flex flex-col w-full bg-gradient-to-r from-slate-600 to-gray-700 shadow-2xl border-b border-slate-500">
      <h6 className="text-gold-600 md:text-base self-start px-4 md:px-8 py-2">
        No groups in common
      </h6>
      <button className="flex items-center gap-4 md:gap-6 text-slate-200 hover:bg-gradient-to-r from-slate-500 to-slate-600 px-4 md:px-8 py-5 min-w-0">
        <div className="flex items-center justify-center border-2 border-gold-900 h-10 w-10 rounded-full flex-shrink-0">
          <FaUsers className="text-white h-6 w-6" />
        </div>
        <div className="md:text-base truncate">
          Create group with {combinedData?.title}
        </div>
      </button>
    </div>
  ) : (
    <div className="flex flex-col w-full bg-gradient-to-r from-slate-600 to-gray-700 shadow-2xl border-b border-slate-500">
      <h6 className="text-xs md:text-base text-gold-600 self-start px-4 md:px-8 py-5">
        {`${Object.keys(combinedData.members).length} members`}
      </h6>
      <button className="flex items-center gap-4 md:gap-6 text-slate-200 hover:bg-gradient-to-r from-slate-500 to-slate-600 px-4 md:px-8 py-5 min-w-0">
        <div className="flex items-center justify-center border-2 border-gold-900 h-10 w-10 rounded-full flex-shrink-0">
          <MdPersonAddAlt1 className="text-white h-6 w-6" />
        </div>
        <div className="truncate">Add members</div>
      </button>
      <div className="flex flex-col overflow-y-auto">
        {Object.keys(combinedData.members).map(([id, _name]) => (
          <AdminItem
            key={id}
            userId={id}
            isAdmin={Object.keys(
              combinedData.admins as Record<string, string>
            ).includes(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ContactInfoGroupSection);
