"use server";

import { Message } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function forwardMessage(messageId: number, userIds: number[]) {
  return fetchFromServer<{ data: Message[] }, number[]>(
    `/api/messages/${messageId}/forward`,
    { method: "POST", body: userIds }
  );
}
