"use client";
import { logout } from "@/app/_actions/auth-actions/logout";
import { updateCurrentUser } from "@/app/_actions/user-actions/update-current-user";
import InputField from "@/app/components/input-field/input-field";
import ProfilePicture from "@/app/components/profile-picture/profile-picture";
import ProfileListItem from "@/app/components/profileItem/ProfileItem";
import { sideBarMenuActions } from "@/utils/constants/action-lists/sidebar-actions";
import { profileFields } from "@/utils/constants/profile-fields";
import { updateProfileSchema } from "@/utils/schemas/update-profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FC, memo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { z } from "zod";
import BlocContainer from "../bloc-container/bloc-container";
import { ProfileProps } from "./profile.types";

const Profile: FC<ProfileProps> = (props) => {
  const { data } = props;
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };
  const methods = useForm<z.infer<typeof updateProfileSchema>>({
    defaultValues: {
      email: "",
      username: "",
      phone: "",
      profileInfo: "",
      profilePicture: null,
    },
    values: {
      email: data.email,
      username: data.username,
      phone: data.phone,
      profileInfo: data.profileInfo,
      profilePicture: data.profilePicture,
    },
    mode: "onChange",
    resolver: zodResolver(updateProfileSchema),
  });
  const handleUpdateProfile = (updateData: any) => {
    const formData = new FormData();
    for (const property in updateData) {
      formData.append(property, updateData[property]);
    }
    updateCurrentUser(formData);
  };

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));
  // useEffect(() => {
  //   if (methods.formState?.errors?.profilePicture?.message) {
  //     toast.error(methods.formState?.errors?.profilePicture?.message);
  //   }
  // }, [methods.formState?.errors?.profilePicture?.message]);
  // let content = null;
  // if (isLoading) {
  //   content = <Loader />;
  // } else if (error) {
  //   content = <ErrorBox error={error} />;
  // } else {
  //   content =
  // }
  return (
    <aside
      id="sidebar"
      className="md:flex md:flex-col md:col-span-5 h-full lg:col-span-4 md:border-r md:border-slate-500"
    >
      <FormProvider {...methods}>
        <BlocContainer
        title="Profile"
          label="left_container"
          menuActionList={updatedSideBarMenuActions}
          cssClass="p-2 h-[calc(100vh-3.5rem)]"
        >
          <div
            className="flex flex-col justify-center h-full"

          >
            <div className="flex flex-col items-center justify-center gap-10 md:gap-6 rounded-md p-2 w-full">
              <ProfilePicture id="profilePicture" name="profilePicture" />
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between w-full">
                  <div className="text-sm font-medium text-gold-600 truncate">
                    Personal information
                  </div>
                  <button
                    onClick={handleToggleEdit}
                    className="text-gold-900 rounded-full hover:text-gold-300"
                  >
                    {isEditing ? (
                      <AiOutlineCloseCircle className="text-xl" />
                    ) : (
                      <FaEdit className="text-xl" />
                    )}
                  </button>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    isEditing ? "gap-0" : "gap-6 md:gap-4"
                  } w-full`}
                >
                  {profileFields.map((field, index) =>
                    isEditing ? (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="w-full"
                      >
                        <InputField
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          placeholder={methods.watch?.[field.name]}
                          autoComplete={field.autoComplete}
                          icon={field.icon}
                        />
                      </motion.div>
                    ) : (
                      <ProfileListItem
                        key={field.name}
                        icon={field.icon}
                        value={data?.[field.name]}
                      />
                    )
                  )}
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-full"
                    >
                      <button
                        onClick={methods.handleSubmit(handleUpdateProfile)}
                        className="w-full flex justify-center items-center rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600 disabled:opacity-70 disabled:pointer-events-none"
                        disabled={!methods.formState.isValid}
                      >
                        Save
                      </button>
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </BlocContainer>
      </FormProvider>
    </aside>
  );
};
export default memo(Profile);
