"use server";

import { FriendRequestResponse } from "@/types/FriendRequest";
import { fetchFromServer } from "../fetchFromServer";

export async function updateFriendRequestStatusToAccepted(
  friendRequestId: number
) {
  return fetchFromServer<{ data: FriendRequestResponse }, FormData>(
    `/api/friend-requests/${friendRequestId}/accept`,
    { method: "PATCH" },
    { tag: "requests" }
  );
}
