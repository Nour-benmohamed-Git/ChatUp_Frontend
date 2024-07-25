"use server";

import { UserResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function blockFriend(userId: number) {
  return fetchFromServer<{ data: UserResponse }>(
    `/api/friends/block/${userId}`,
    { method: "POST" },
    { tag: "friends" }
  );
}
