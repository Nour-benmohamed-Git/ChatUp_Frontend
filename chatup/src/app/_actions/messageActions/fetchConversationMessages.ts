"use server";

import { Direction } from "@/utils/constants/globals";
import { fetchFromServer } from "../fetchFromServer";
import { MessagesResponse } from "@/types/Message";

export async function fetchConversationMessages(
  conversationId: string,
  data: {
    limit: number;
    search: string;
    cursor?: { earliest?: number; latest?: number };
    direction: Direction;
    startIndex: number;
  } = {
    limit: 10,
    search: "",
    cursor: { earliest: undefined, latest: undefined },
    direction: Direction.FORWARD,
    startIndex: 0,
  }
) {
  return fetchFromServer<
    MessagesResponse,
    {
      limit: number;
      search: string;
      cursor?: { earliest?: number; latest?: number };
      direction?: Direction;
      startIndex: number;
    }
  >(`/api/messages/${conversationId}/chat-sessions`, {
    method: "POST",
    body: data,
    // next: { tags: ["messages"] },
  });
}
