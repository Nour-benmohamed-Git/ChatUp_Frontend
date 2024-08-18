import { ConversationsResponse } from "@/types/ChatSession";
import { UserResponse } from "@/types/User";
export interface ConversationListProps {
  label: string;
  initialConversations: ConversationsResponse;
  currentUser: UserResponse;
}
