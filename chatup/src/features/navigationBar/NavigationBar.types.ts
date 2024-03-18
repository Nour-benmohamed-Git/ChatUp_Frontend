import { UserResponse } from "@/types/User";

export interface NavigationBarProps {
  currentUser: UserResponse;
  initialUnseenConversationsCount: number;
  initialUnseenFriendRequestsCount: number;
}
