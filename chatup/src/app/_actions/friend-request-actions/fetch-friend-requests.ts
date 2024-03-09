"use server";

import { NotificationsResponse } from "@/types/Notification";
import { cookies } from "next/headers";

export async function fetchFriendRequests(): Promise<NotificationsResponse> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/notifications/own-friend-requests`,
    {
      method: "GET",
      headers: headers,
      next: { tags: ["requests"] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch friend requests.");
  }
  return res.json();
}
