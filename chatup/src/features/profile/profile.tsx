import ErrorBox from "@/components/error-box/error-box";
import InputField from "@/components/input-field/input-field";
import Loader from "@/components/loader/loader";
import ProfileListItem from "@/components/profile-list-item/profile-list-item";
import ProfilePicture from "@/components/profile-picture/profile-picture";
import {
  useEditCurrentUserMutation
} from "@/redux/apis/profile/profileApi";
import { UserUpdateRequest } from "@/types/User";
import { profileFields } from "@/utils/constants/profile-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FC, memo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import { z } from "zod";
import { ProfileProps } from "./profile.types";

const Profile: FC<ProfileProps> = (props) => {
  const { data, isLoading, error } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [EditCurrentUser, { isLoading: isLoadingEdit }] =
    useEditCurrentUserMutation();
  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };
  const schema = z.object({
    email: z.string().min(1, "Email is required.").email("Email is invalid."),
    username: z.string().min(1, "Username is required."),
    phone: z.string().min(1, "Phone number is required."),
    profileInfo: z.string().min(1, "Profile info is required."),
    profilePicture: z.any().optional(),
    // .any()
    // .refine((file) => file !== null, { message: "Image is required." })
    // .refine(
    //   (file) => acceptedImageTypes.includes(file?.type),
    //   "Supported formats: .jpg, .jpeg, .png, .webp ."
    // )
    // .refine((file) => file?.size <= maxFileSize, `Max image size is 5MB.`),
  });

  const methods = useForm<UserUpdateRequest>({
    defaultValues: {
      email: "",
      username: "",
      phone: "",
      profileInfo: "",
      profilePicture: null,
    },
    values: {
      email: data?.email,
      username: data?.username,
      phone: data?.phone,
      profileInfo: data?.profileInfo,
      profilePicture: data?.profilePicture,
    },
    mode: "onChange",
    resolver: zodResolver(schema),
  });
  const handleUpdateProfile = (updateData: UserUpdateRequest) => {
    const formData = new FormData();
    for (const property in updateData) {
      formData.append(property, updateData[property]);
    }
    EditCurrentUser(formData);
  };
  // useEffect(() => {
  //   if (methods.formState?.errors?.profilePicture?.message) {
  //     toast.error(methods.formState?.errors?.profilePicture?.message);
  //   }
  // }, [methods.formState?.errors?.profilePicture?.message]);
  let content = null;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <ErrorBox error={error} />;
  } else {
    content = profileFields.map((field, index) =>
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
    );
  }
  return (
    <FormProvider {...methods}>
      <div
        className="flex flex-col justify-between"
        style={{ height: "calc(100% - 4rem)" }}
      >
        <div className="flex flex-col items-center justify-center gap-10 md:gap-6 rounded-md py-2 w-full">
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
              {content}
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
                    disabled={!methods.formState.isValid || isLoadingEdit}
                  >
                    {isLoadingEdit ? (
                      <ImSpinner9 size={20} className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
export default memo(Profile);
