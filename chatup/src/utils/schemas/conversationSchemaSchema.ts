import { z } from "zod";
import { ChatSessionType } from "../constants/globals";

export const groupConversationSchema = z.object({
  title: z.string().min(1, "Group title is required."),
  image: z.any().optional(),
  type: z.nativeEnum(ChatSessionType),
  otherMembersIds: z
    .array(z.number())
    .min(1, "At least one member is required."),
});
