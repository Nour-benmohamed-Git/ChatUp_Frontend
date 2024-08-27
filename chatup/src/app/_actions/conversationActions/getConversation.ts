"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function getConversation(conversationId: string) {
  return fetchFromServer<{ data: ConversationResponse }>(
    `/api/chat-sessions/${conversationId}`,
    {
      method: "GET",
    }
  );
}
