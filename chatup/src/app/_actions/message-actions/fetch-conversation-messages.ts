"use server";

import { Messages } from "@/types/Message";
import { cookies } from "next/headers";

export async function fetchConversationMessages(
  conversationId: string
): Promise<Messages> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/messages/${conversationId}/chat-sessions`,
    {
      method: "GET",
      headers: headers,
      next: { tags: ["messages"] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch messages.");
  }

  return res.json();
}
