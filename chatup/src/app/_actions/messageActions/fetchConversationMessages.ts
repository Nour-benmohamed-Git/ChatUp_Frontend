"use server";

import { Messages } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchConversationMessages(conversationId: string) {
  return fetchFromServer<Messages>(
    `/api/messages/${conversationId}/chat-sessions`,
    {
      method: "GET",
      next: { tags: ["messages"] },
    }
  );
}
