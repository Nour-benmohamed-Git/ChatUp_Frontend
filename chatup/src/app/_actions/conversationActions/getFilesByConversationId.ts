"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function getFilesByConversationId(conversationId: string) {
  return fetchFromServer<{ data: File[] }, string>(
    `/api/chat-sessions/${conversationId}/files`,
    { method: "GET" }
  );
}
