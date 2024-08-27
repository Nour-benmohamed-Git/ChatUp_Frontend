import Avatar from "@/app/components/avatar/Avatar";
import InputField from "@/app/components/inputField/InputField";
import ProfilePicture from "@/app/components/profilePicture/ProfilePicture";
import { FC, memo } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { GroupFormProps } from "./GroupForm.types";

const GroupForm: FC<GroupFormProps> = (props) => {
  const { checkedUsers, initialFriends } = props;

  return (
    <div className="flex flex-col gap-4 h-full w-full p-4 bg-gradient-to-r from-black via-gray-900 to-gray-700 shadow-md rounded-md">
      {checkedUsers.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <p className="text-gold-600 text-sm">Selected members</p>
          <div className="flex items-center w-full flex-wrap gap-2">
            {[...checkedUsers].map((userId) => {
              const user = initialFriends.data.find(
                (user) => user.id === userId
              );
              return user ? (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 bg-gold-200 rounded-lg shadow-md"
                >
                  <Avatar
                    fileName={user.profilePicture}
                    additionalClasses="w-8 h-8"
                    rounded="rounded-full"
                  />
                  <span className="flex-grow text-gray-700">
                    {user.username}
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
      <p className="text-gold-600 text-sm">Add group icon</p>
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <ProfilePicture id="image" name="image" />
        <div className="text-xs text-center text-gray-400">
          Supported formats: JPG, JPEG, PNG, GIF
          <br />
          Maximum file size: 5 MB
        </div>
      </div>
      <p className="text-gold-600 text-sm">Add group title</p>
      <InputField
        id="title"
        name="title"
        type="text"
        placeholder="Group title"
        autoComplete="group"
        icon={<MdOutlineGroupAdd />}
      />
    </div>
  );
};

export default memo(GroupForm);
