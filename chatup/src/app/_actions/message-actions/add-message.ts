"use server";

import { Message } from "@/types/Message";
import { cookies } from "next/headers";

export async function addMessage(data: Message): Promise<{ data: Message }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/messages`,
    { method: "POST", body: JSON.stringify(data), headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to create a new message.");
  }
  return res.json();
}
