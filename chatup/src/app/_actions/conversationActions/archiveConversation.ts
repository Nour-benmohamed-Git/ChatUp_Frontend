"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function archiveConversation(data: { conversationId: number }) {
  return fetchFromServer<
    { data: ConversationResponse },
    {
      conversationId: number;
    }
  >(
    `/api/chat-sessions/${data.conversationId}/archive`,
    {
      method: "POST",
      body: data,
    },
    { tag: "conversations" }
  );
}
