"use client";
import { logout } from "@/app/_actions/authActions/logout";
import { updateCurrentUser } from "@/app/_actions/userActions/updateCurrentUser";
import Avatar from "@/app/components/avatar/Avatar";
import InputField from "@/app/components/inputField/InputField";
import ProfileListItem from "@/app/components/profileItem/ProfileItem";
import ProfilePicture from "@/app/components/profilePicture/ProfilePicture";
import { sideBarMenuActions } from "@/utils/constants/actionLists/sideBarActions";
import { profileFields } from "@/utils/constants/profileFields";
import { updateProfileSchema } from "@/utils/schemas/updateProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FC, memo, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";
import SubmitButton from "../authSection/submitButton/SubmitButton";
import BlocContainer from "../blocContainer/BlocContainer";
import { ProfileProps } from "./Profile.types";
import { FetchError } from "@/app/_actions/fetchFromServer";

const Profile: FC<ProfileProps> = (props) => {
  const { data } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      for (const property in data) {
        formData.append(
          property,
          data[property as keyof z.infer<typeof updateProfileSchema>]
        );
      }
      const response = await updateCurrentUser(null, formData);
      if ((response as FetchError)?.error) {
        toast.error((response as FetchError)?.error);
      } else {
        toast.success("Profile has been successfully updated.");
        handleToggleEdit();
      }
    });
  };
  return (
    <aside
      id="sidebar"
      className="md:flex md:flex-col md:col-span-5 h-full lg:col-span-4 md:border-r md:border-slate-500"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <BlocContainer
            title="Profile"
            label="left_container"
            menuActionList={updatedSideBarMenuActions}
            cssClass="p-2 h-[calc(100vh-3.5rem)]"
          >
            <div className="flex flex-col h-full">
              <div className="flex flex-col items-center justify-center gap-10 md:gap-6 rounded-md p-2 w-full">
                {isEditing ? (
                  <ProfilePicture id="profilePicture" name="profilePicture" />
                ) : (
                  <Avatar
                    additionalClasses="h-32 w-32 rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
                    fileName={methods.getValues("profilePicture")}
                  />
                )}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between w-full">
                    <div className="text-sm font-medium text-gold-900 truncate">
                      Personal information
                    </div>
                    <button
                      type="button"
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
                            placeholder={methods.getValues(field.name)}
                            autoComplete={field.autoComplete}
                            icon={field.icon}
                          />
                        </motion.div>
                      ) : (
                        <ProfileListItem
                          key={field.name}
                          icon={field.icon}
                          value={
                            data?.[
                              field.name as keyof z.infer<
                                typeof updateProfileSchema
                              >
                            ]
                          }
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
                        <SubmitButton isPending={isPending} text={"UPDATE"} />
                      </motion.div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </BlocContainer>
        </form>
      </FormProvider>
    </aside>
  );
};
export default memo(Profile);
