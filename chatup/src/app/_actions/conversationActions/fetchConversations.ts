"use server";

import { ConversationsResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchConversations(
  data: {
    page: number;
    offset: number;
    search: string;
  } = {
    page: 1,
    offset: 30,
    search: "",
  }
) {
  return fetchFromServer<
    ConversationsResponse,
    {
      page: number;
      offset: number;
      search: string;
    }
  >(`/api/current-user-chat-sessions`, {
    method: "POST",
    body: data,
    next: { tags: ["conversations"] },
  });
}
