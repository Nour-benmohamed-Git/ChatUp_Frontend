"use server";

import { ConversationsResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";
import { ConversationFilter } from "@/utils/constants/globals";

export async function fetchConversations(
  data: {
    page?: number;
    offset?: number;
    search?: string;
    filter?: ConversationFilter;
  } = {
    page: 1,
    offset: 30,
    search: "",
    filter: ConversationFilter.ALL,
  }
) {
  return fetchFromServer<
    ConversationsResponse,
    {
      page?: number;
      offset?: number;
      search?: string;
      filter?: ConversationFilter;
    }
  >(`/api/current-user-chat-sessions`, {
    method: "POST",
    body: data,
    next: { tags: ["conversations"] },
  });
}
