"use server";

import { UserResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function removeFriend(userId: number) {
  return fetchFromServer<{ data: UserResponse }>(
    `/api/current-user/${userId}/remove-friend`,
    { method: "DELETE" },
    { tag: "friends" }
  );
}
