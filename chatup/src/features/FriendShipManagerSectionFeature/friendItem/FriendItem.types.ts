import { UserResponse } from "@/types/User";

export interface FriendItemProps {
  userData: UserResponse;
  handleCreateNewChat: (userId: number) => void;
}
