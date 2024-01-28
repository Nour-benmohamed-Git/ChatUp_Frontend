import ErrorBox from "@/components/error-box/error-box";
import Loader from "@/components/loader/loader";
import ProfileListItem from "@/components/profile-list-item/profile-list-item";
import ProfilePicture from "@/components/profile-picture/profile-picture";
import { useGetCurrentUserQuery } from "@/redux/apis/profile/profileApi";
import { profileFields } from "@/utils/constants/profile-fields";
import { FC } from "react";
import { FaUserEdit } from "react-icons/fa";

const Profile: FC = () => {
  const { data, isLoading, error } = useGetCurrentUserQuery();

  let content = null;
  if (isLoading) {
    content = <Loader />;
  }
  if (error) {
    content = <ErrorBox error={error} />;
  }

  content = profileFields.map((field) => (
    <ProfileListItem
      key={field.name}
      icon={field.icon}
      value={data?.data?.[field.name]}
    />
  ));

  return (
    <div
      className="flex flex-col justify-between"
      style={{ height: "calc(100% - 4rem)" }}
    >
      <div className="flex flex-col items-center justify-center gap-10 md:gap-6 rounded-md py-2 w-full">
        <ProfilePicture />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between w-full">
            <div className="text-xs font-medium text-gold-600 truncate">
              Personal information
            </div>
            <button className="text-gold-900 rounded-full hover:text-gold-50">
              <FaUserEdit className="text-lg" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-6 md:gap-4 w-full">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
