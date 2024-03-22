"use server";

import { Message } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function hardRemoveMessage(messageId: number) {
  return fetchFromServer<{ data: Message }>(
    `/api/messages/hard-delete/${messageId}`,
    {
      method: "DELETE",
    }
  );
}
