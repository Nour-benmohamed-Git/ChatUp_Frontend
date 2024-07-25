"use server";

import { UserResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function unblockFriend(userId: number) {
  return fetchFromServer<{ data: UserResponse }>(
    `/api/friends/unblock/${userId}`,
    { method: "DELETE" }
  );
}
