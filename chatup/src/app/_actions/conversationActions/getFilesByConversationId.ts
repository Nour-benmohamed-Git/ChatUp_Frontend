"use server";

import { MessageFile } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function getFilesByConversationId(conversationId: number) {
  return fetchFromServer<{ data: MessageFile[] }, number>(
    `/api/chat-sessions/${conversationId}/files`,
    { method: "GET" }
  );
}
