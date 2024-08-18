import { ConversationsResponse } from "@/types/ChatSession";
import { UserResponse } from "@/types/User";
export interface ConversationListContainerProps {
  initialConversations: ConversationsResponse;
  currentUser: UserResponse;
}
