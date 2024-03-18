"use server";

import { cookies } from "next/headers";

export async function getUnseenConversationsCount(): Promise<{ data: number }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/current-user-unseen-chat-sessions`,
    { method: "GET", headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to get unseen conversations count.");
  }
  return res.json();
}
