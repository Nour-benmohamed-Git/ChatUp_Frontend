import { z } from "zod";

export const updateProfileSchema = z.object({
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
  export type ProfileField = {
    name: keyof z.infer<typeof updateProfileSchema>;
    icon: JSX.Element;
    type: string;
    autoComplete: string;
  };