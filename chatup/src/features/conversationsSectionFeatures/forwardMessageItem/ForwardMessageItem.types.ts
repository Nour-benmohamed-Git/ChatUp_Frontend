import { UserResponse } from "@/types/User";

export interface ForwardMessageItemProps {
  userData: UserResponse;
  onCheckChange: () => void
  isChecked: boolean
}
