"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function blockFriend(userId: number) {
  return fetchFromServer<{ data: boolean }>(`/api/users/isBlocked/${userId}`, {
    method: "GET",
  });
}
