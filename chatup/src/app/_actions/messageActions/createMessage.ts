"use server";

import { MessageResponse } from "@/types/Message";
import { fetchFromServer } from "../fetchFromServer";

export async function createMessage(formData: FormData) {
  return fetchFromServer<{ data: MessageResponse }, FormData>("/api/messages", {
    method: "POST",
    body: formData,
  });
}
