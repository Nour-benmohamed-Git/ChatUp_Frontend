import { FriendRequestsResponse } from "@/types/FriendRequest";
import { UserResponse, UsersResponse } from "@/types/User";

export interface FriendsContainerProps {
  initialFriendRequests: FriendRequestsResponse;
  initialFriends: UsersResponse;
  currentUser: UserResponse;
}
