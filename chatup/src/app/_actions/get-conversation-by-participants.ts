"use server";

import { ConversationResponse } from "@/types/ChatSession";
import { cookies } from "next/headers";

export async function getConversationByParticipants(data: {
  secondMemberId: string;
}): Promise<{ data: ConversationResponse }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/chat-sessions/by-participants`,
    { method: "POST", body: JSON.stringify(data), headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to find conversation.");
  }

  return res.json();
}
