"use server";

import { Message } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function softRemoveMessage(messageId: number) {
  return fetchFromServer<{ data: Message }>(
    `/api/messages/soft-delete/${messageId}`,
    {
      method: "PATCH",
    },
    { tag: "messages" }
  );
}
