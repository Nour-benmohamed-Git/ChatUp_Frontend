"use server";

import { FriendRequestResponse } from "@/types/FriendRequest";
import { fetchFromServer } from "../fetchFromServer";

export async function updateFriendRequestStatusToAccepted(
  friendRequestId: number
) {
  return fetchFromServer<{ data: FriendRequestResponse }>(
    `/api/friendRequests/${friendRequestId}/accept`,
    { method: "PATCH" },
    { tag: "requests" }
  );
}
