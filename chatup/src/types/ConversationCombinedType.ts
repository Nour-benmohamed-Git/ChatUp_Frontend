import { ChatSessionType } from "@/utils/constants/globals";

export interface ConversationCombinedType {
  conversationId: number | "new";
  type: ChatSessionType;
  image?: string | string[];
  title?: string;
  subTitle?: string;
  description?: string;
  members?: { [userId: string]: string };
  admins?: { [userId: string]: string };
  additionalInfo?: number | string[];
}
