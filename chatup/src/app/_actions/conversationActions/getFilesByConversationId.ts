"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function getFilesByConversationId(conversationId: number) {
  return fetchFromServer<{ data: File[] }, number>(
    `/api/chat-sessions/${conversationId}/files`,
    { method: "GET" }
  );
}
