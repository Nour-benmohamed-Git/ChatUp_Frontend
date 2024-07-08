import { z } from "zod";

export const addFriendRequestSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Email is invalid."),
});
