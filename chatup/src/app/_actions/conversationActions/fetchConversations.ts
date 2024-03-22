"use server";

import { ConversationsResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchConversations(
  page: number = 1,
  offset: number = 10,
  search: string = ""
) {
  return fetchFromServer<ConversationsResponse>(
    `/api/current-user-chat-sessions?page=${page}&offset=${offset}&search=${search}`,
    {
      method: "GET",
      next: { tags: ["conversations"] },
    }
  );
}
