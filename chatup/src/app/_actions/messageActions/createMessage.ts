"use server";

import { Message } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function createMessage(formData: FormData) {
  return fetchFromServer<{ data: Message }, FormData>("/api/messages", {
    method: "POST",
    body: formData,
  });
}
