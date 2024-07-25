"use server";

import { FriendRequestResponse } from "@/types/FriendRequest";
import { fetchFromServer } from "../fetchFromServer";

export async function sendFriendRequestFromSuggestion(suggestionId: number) {
  return fetchFromServer<{ data: FriendRequestResponse }, FormData>(
    `/api/friend-requests/${suggestionId}`,
    { method: "POST" },
    { tag: "suggestions" }
  );
}
