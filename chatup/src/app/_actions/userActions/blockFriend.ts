"use server";

import { UserResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function blockFriend(userId: number) {
  return fetchFromServer<{ data: UserResponse }>(
    `/api/users/block/${userId}`,
    { method: "POST" },
    { tag: "friends" }
  );
}
