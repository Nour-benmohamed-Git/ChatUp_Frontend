"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function isFriendBlocked(userId: number) {
  return fetchFromServer<{ data: boolean }>(`/api/friends/is-blocked/${userId}`, {
    method: "GET",
  });
}
