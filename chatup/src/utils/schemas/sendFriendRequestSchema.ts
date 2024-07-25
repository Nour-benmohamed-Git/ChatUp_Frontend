import { z } from "zod";
import { EnabledInput } from "../constants/globals";

export const sendFriendRequestSchema = z
  .object({
    enabledInput: z.nativeEnum(EnabledInput),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.enabledInput === EnabledInput.EMAIL) {
      if (!z.string().min(1).safeParse(data?.email).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required.",
          path: ["email"],
        });
      }
      if (!z.string().email().safeParse(data?.email).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is invalid.",
          path: ["email"],
        });
      }
    }

    if (data.enabledInput === EnabledInput.PHONE) {
      if (!z.string().min(1).safeParse(data?.phone).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required.",
          path: ["phone"],
        });
      }
    }
  });
