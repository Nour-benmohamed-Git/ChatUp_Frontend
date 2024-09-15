"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function unArchiveConversation(data: { conversationId: number }) {
  return fetchFromServer<
    { data: ConversationResponse },
    {
      conversationId: number;
    }
  >(
    `/api/chat-sessions/${data.conversationId}/unarchive`,
    {
      method: "POST",
      body: data,
    },
    { tag: "conversations" }
  );
}
