"use server";

import { Message } from "@/types/Message";
import { cookies } from "next/headers";

export async function hardRemoveMessage(
  messageId: number
): Promise<{ data: Message }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/messages/${messageId}`,
    { method: "DELETE", headers: headers }
  );
  try {
    return res.json();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to hard remove the message.");
  }
}
