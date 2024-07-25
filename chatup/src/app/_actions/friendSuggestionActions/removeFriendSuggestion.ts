"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function removeFriendSuggestion(suggestionId: number) {
  return fetchFromServer<{ data: { isRemoved: boolean } }>(
    `/api/friend-suggestions/${suggestionId}`,
    { method: "DELETE" },
    { tag: "suggestions" }
  );
}
