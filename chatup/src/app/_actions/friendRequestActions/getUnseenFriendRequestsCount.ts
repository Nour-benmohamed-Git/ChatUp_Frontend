"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function getUnseenFriendRequestsCount() {
  return fetchFromServer<{ data: number }>(
    `/api/friendRequests/unseen-friend-requests-count`,
    { method: "GET" }
  );
}
