"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function addConversation(data: { secondMemberId: number }) {
  return fetchFromServer<
    { data: ConversationResponse },
    {
      secondMemberId: number;
    }
  >(
    `/api/chat-sessions`,
    { method: "POST", body: data },
    { redirectTo: "/conversations" }
  );
}
