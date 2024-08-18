"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function removeReaction(messageId: number) {
  return fetchFromServer<{ data: Record<number, string>}, number>(
    `/api/message-reaction/${messageId}`,
    {
      method: "DELETE",
    }
  );
}
