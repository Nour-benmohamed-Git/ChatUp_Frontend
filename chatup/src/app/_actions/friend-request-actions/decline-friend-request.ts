"use server";

import { NotificationResponse } from "@/types/Notification";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function updateFriendRequestStatusToDeclined(
  friendRequestId: number
): Promise<{ data: NotificationResponse }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/notifications/${friendRequestId}/decline`,
    {
      method: "PATCH",
      headers: headers,
    }
  );
  try {
    revalidateTag("requests");
    return res.json();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to decline the friend request.");
  }
}
