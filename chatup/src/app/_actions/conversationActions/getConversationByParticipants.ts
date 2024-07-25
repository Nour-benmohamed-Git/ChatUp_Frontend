"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function getConversationByParticipants(data: {
  secondMemberId: number;
}) {
  return fetchFromServer<
    { data: ConversationResponse },
    {
      secondMemberId: number;
    }
  >(`/api/chat-sessions/by-participants`, { method: "POST", body: data });
}
