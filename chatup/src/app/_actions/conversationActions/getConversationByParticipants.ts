"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { fetchFromServer } from "../fetchFromServer";

export async function getConversationByParticipants(data: {
  secondMemberId: string;
}) {
  return fetchFromServer<
    { data: ConversationResponse },
    {
      secondMemberId: string;
    }
  >(`/api/chat-sessions/by-participants`, { method: "POST", body: data });
}
