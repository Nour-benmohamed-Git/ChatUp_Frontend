import { ConversationsResponse } from "@/types/ChatSession";
import { UserResponse, UsersResponse } from "@/types/User";

export interface SidebarProps {
  initialConversations: ConversationsResponse;
  initialFriends: UsersResponse;
  currentUser: UserResponse;
}
