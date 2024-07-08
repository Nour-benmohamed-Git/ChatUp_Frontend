import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First Name is required."),
    lastName: z.string().min(1, "Last Name is required."),
    email: z.string().min(1, "Email is required.").email("Email is invalid."),
    phone: z.string().min(1, "Phone number is required."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
