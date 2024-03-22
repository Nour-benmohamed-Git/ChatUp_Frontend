"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function updateConversation(conversationId: number) {
  return fetchFromServer<{ data: ConversationResponse }>(
    `/api/chat-sessions/${conversationId}`,
    { method: "PUT" },
    { tag: "conversations" }
  );
}
