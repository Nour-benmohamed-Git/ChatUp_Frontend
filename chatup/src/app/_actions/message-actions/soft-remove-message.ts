"use server";

import { Message } from "@/types/Message";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function softRemoveMessage(
  messageId: number
): Promise<{ data: Message }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/messages/${messageId}`,
    { method: "PATCH", headers: headers }
  );
  try {
    revalidateTag("messages");
    return res.json();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to soft remove the message.");
  }
}
