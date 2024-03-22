"use server";

import { Message } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function addMessage(data: Message) {
  return fetchFromServer<{ data: Message }, Message>("/api/messages", {
    method: "POST",
    body: data,
  });
}
