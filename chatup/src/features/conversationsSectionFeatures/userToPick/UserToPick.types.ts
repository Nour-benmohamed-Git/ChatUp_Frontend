import { UserResponse } from "@/types/User";

export interface UserToPickProps {
  userData: UserResponse;
  onCheckChange: () => void;
  isChecked: boolean;
}
