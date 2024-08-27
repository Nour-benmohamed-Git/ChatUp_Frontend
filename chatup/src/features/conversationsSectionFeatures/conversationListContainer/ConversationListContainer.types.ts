import { ConversationsResponse } from "@/types/ChatSession";
import { UserResponse, UsersResponse } from "@/types/User";
export interface ConversationListContainerProps {
  initialConversations: ConversationsResponse;
  currentUser: UserResponse;
  initialFriends: UsersResponse;
}
