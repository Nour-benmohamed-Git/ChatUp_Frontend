"use server";

import { FriendRequestsResponse } from "@/types/FriendRequest";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchFriendRequests() {
  return fetchFromServer<FriendRequestsResponse>(
    `/api/friendRequests/own-friend-requests`,
    { method: "GET", next: { tags: ["requests"] } }
  );
}
