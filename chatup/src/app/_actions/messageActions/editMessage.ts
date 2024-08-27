"use server";

import { Message } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function editMessage(messageId: number, content: string) {
  return fetchFromServer<{ data: Message }, { content: string }>(
    `/api/messages/${messageId}`,
    {
      method: "PATCH",
      body: { content: content },
    }
  );
}
