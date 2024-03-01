import { ConversationResponse } from "@/types/ChatSession";

export interface UnreadMessagesCounterProps {
  conversation: ConversationResponse;
  currentUserId: number;
}
