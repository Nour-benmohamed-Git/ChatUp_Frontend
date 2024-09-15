"use server";

import { MessageResponse } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function softDeleteMessage(messageId: number) {
  return fetchFromServer<{ data: MessageResponse }>(
    `/api/messages/soft-delete/${messageId}`,
    {
      method: "PATCH",
    }
  );
}
