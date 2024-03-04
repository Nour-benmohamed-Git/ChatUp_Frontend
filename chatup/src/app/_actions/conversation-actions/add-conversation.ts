"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function addConversation(data: {
  secondMemberId: number;
}): Promise<{ data: ConversationResponse }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/chat-sessions`,
    { method: "POST", body: JSON.stringify(data), headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to create a new conversation");
  }
  revalidateTag("conversations");
  return res.json();
}
