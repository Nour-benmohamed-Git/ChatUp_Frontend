"use server";

import { MessageResponse } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function forwardMessage(messageId: number, conversationIds: number[]) {
  return fetchFromServer<{ data: MessageResponse[] }, number[]>(
    `/api/messages/${messageId}/forward`,
    { method: "POST", body: conversationIds }
  );
}
