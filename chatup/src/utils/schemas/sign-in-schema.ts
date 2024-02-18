import { z } from "zod";

export const schema = z.object({
  email: z.string().min(1, "Email is required.").email("Email is invalid."),
  password: z.string().min(1, "Password is invalid."),
});
