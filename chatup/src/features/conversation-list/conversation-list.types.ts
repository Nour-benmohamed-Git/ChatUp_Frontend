import { ConversationResponse } from "@/types/ChatSession";
import { UserResponse, UsersResponse } from "@/types/User";

export interface ConversationListProps {
  initialConversations: ConversationResponse[];
  initialUsers: UsersResponse;
  currentUser: UserResponse;
}
