"use server";
import { FriendSuggestionsResponse } from "@/types/Suggestions";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchSuggestions(page: number = 1, offset: number = 10) {
  return fetchFromServer<FriendSuggestionsResponse>(
    `/api/friend-suggestions?page=${page}&offset=${offset}`,
    {
      method: "GET",
      next: { tags: ["suggestions"] },
    }
  );
}
