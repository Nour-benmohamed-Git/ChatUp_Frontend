"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function updateConversation(
  conversationId: number
): Promise<{ data: ConversationResponse }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/chat-sessions/${conversationId}`,
    { method: "PUT", headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to update conversation.");
  }
  revalidateTag("conversations");
  return res.json();
}
