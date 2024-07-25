"use server";

import { FriendRequestResponse } from "@/types/FriendRequest";
import { fetchFromServer } from "../fetchFromServer";

export async function updateFriendRequestStatusToDeclined(
  friendRequestId: number
) {
  return fetchFromServer<{ data: FriendRequestResponse }>(
    `/api/friend-requests/${friendRequestId}/decline`,
    { method: "PATCH" },
    { tag: "requests" }
  );
}
