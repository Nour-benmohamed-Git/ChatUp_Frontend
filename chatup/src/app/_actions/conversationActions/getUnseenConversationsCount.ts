"use server";

import { fetchFromServer } from "../fetchFromServer";

export async function getUnseenConversationsCount() {
  return fetchFromServer<{ data: number }>(
    `/api/current-user-unseen-chat-sessions`,
    { method: "GET" }
  );
}
