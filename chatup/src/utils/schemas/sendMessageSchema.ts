import { z } from "zod";
import {
  isValidFileExtension,
  isValidFileSize,
} from "../helpers/sharedHelpers";

export const sendMessageSchema = z
  .object({
    id: z.number().optional(),
    message: z
      .string()
      .optional()
      .refine((msg) => !msg || msg.trim() !== "", {
        message: "Message cannot be empty.",
      }),
    files: z.array(z.instanceof(File)).optional(),
    reaction: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.files?.length) return z.NEVER;
    val.files.forEach((file, index) => {
      const typeValidation = isValidFileExtension(file);
      const sizeValidation = isValidFileSize(file);

      if (!typeValidation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: typeValidation.message,
          path: ["files", index],
        });
      }

      if (!sizeValidation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: sizeValidation.message,
          path: ["files", index],
        });
      }
    });
  });
