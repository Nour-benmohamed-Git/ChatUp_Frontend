"use server";

import { UserResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function removeFriend(userId: number) {
  return fetchFromServer<{ data: UserResponse }>(
    `/api/friends/${userId}`,
    { method: "DELETE" },
    { tag: "friends" }
  );
}
