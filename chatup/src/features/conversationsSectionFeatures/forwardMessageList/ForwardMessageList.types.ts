import { UsersResponse } from "@/types/User";
import { Dispatch, SetStateAction } from "react";

export interface ForwardMessageListProps {
  initialFriends: UsersResponse;
  checkedUsers: Set<number>;
  setCheckedUsers: Dispatch<SetStateAction<Set<number>>>
}
