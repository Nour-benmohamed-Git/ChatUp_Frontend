"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function getConversationById(conversationId: string) {
  return fetchFromServer<{ data: ConversationResponse }>(
    `/api/chat-sessions/${conversationId}`,
    {
      method: "GET",
    }
  );
}
