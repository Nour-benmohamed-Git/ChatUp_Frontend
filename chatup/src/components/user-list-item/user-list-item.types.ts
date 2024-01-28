import { UserResponse } from "@/types/User";

export interface UserListItemProps {
  userData: UserResponse;
  handleCreateNewChat: (userId: number) => void;
}
