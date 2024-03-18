"use server";

import { ConversationsResponse } from "@/types/ChatSession";
import { cookies } from "next/headers";

export async function fetchConversations(
  page: number = 1,
  offset: number = 10,
  search: string = ""
): Promise<ConversationsResponse> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/current-user-chat-sessions?page=${page}&offset=${offset}&search=${search}`,
    { method: "GET", headers: headers, next: { tags: ["conversations"] } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversations.");
  }
  return res.json();
}
