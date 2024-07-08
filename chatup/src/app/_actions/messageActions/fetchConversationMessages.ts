"use server";

import { Messages } from "@/types/Message";
import { Direction } from "@/utils/constants/globals";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchConversationMessages(
  conversationId: string,
  data: {
    limit: number;
    search: string;
    cursor?: { earliest?: number; latest?: number };
    direction: Direction;
  } = {
    limit: 10,
    search: "",
    cursor: { earliest: undefined, latest: undefined },
    direction: Direction.FORWARD,
  }
) {
  return fetchFromServer<
    Messages,
    {
      limit: number;
      search: string;
      cursor?: { earliest?: number; latest?: number };
      direction?: Direction;
    }
  >(`/api/messages/${conversationId}/chat-sessions`, {
    method: "POST",
    body: data,
    next: { tags: ["messages"] },
  });
}
