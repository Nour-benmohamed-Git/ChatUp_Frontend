"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function addOrUpdateReaction(data: {
  messageId: number;
  reaction: string;
}) {
  return fetchFromServer<
    { data: Record<number, string> },
    {
      messageId: number;
      reaction: string;
    }
  >("/api/message-reaction", {
    method: "POST",
    body: data,
  });
}
