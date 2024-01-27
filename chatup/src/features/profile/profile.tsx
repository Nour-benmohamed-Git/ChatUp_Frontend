import ProfilePicture from "@/components/profile-picture/profile-picture";
import { FC, memo } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa6";
import { IoLocationOutline, IoMailOutline } from "react-icons/io5";

const Profile: FC = () => {
  return (
    <div
      className="flex flex-col justify-between"
      style={{ height: "calc(100% - 4rem)" }}
    >
      <div className="flex flex-col items-center justify-center gap-6 rounded-md bg-gradient-to-r from-gray-700 via-gold-100 to-slate-700 py-6 w-full">
        <ProfilePicture />
        <div className="flex flex-col gap-2 w-11/12">
          <div className="flex justify-between w-full">
            <div className="text-sm font-medium text-gray-900 truncate">
              Personal Information
            </div>
            <button>Edit</button>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center justify-between min-w-0 bg-gray-900 rounded-md px-2 py-3 w-full">
              <div className="flex items-center rounded-md text-gold-900 hover:text-gold-50">
                <FaRegAddressCard size={20} />
              </div>
              <div className="text-xs text-white truncate">
                nourelhakbenmohamed@gmail.com
              </div>
            </div>
            <div className="flex items-center justify-between min-w-0 bg-gray-900 rounded-md px-2 py-3 w-full">
              <div className="flex items-center rounded-md text-gold-900 hover:text-gold-50">
                <FaMobileAlt size={20} />
              </div>
              <div className="text-xs text-white truncate">21628271230</div>
            </div>
            <div className="flex items-center justify-between min-w-0 bg-gray-900 rounded-md px-2 py-3 w-full">
              <div className="flex items-center rounded-md text-gold-900 hover:text-gold-50">
                <IoMailOutline size={20} />
              </div>
              <div className="text-xs text-white truncate">
                nour elhak benmohamed
              </div>
            </div>
            <div className="flex items-center justify-between min-w-0 bg-gray-900 rounded-md px-2 py-3 w-full">
              <div className="flex items-center rounded-md text-gold-900 hover:text-gold-50">
                <IoLocationOutline size={20} />
              </div>
              <div className="text-xs text-white truncate">
                tunis, kasserine 2237 ,cité olypmique.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-700 via-gold-100 to-slate-700 w-full">
        logout
      </div>
    </div>
  );
};
export default memo(Profile);
