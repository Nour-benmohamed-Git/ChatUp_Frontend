"use server";

import { FriendRequestsResponse } from "@/types/FriendRequest";
import { cookies } from "next/headers";

export async function fetchFriendRequests(): Promise<FriendRequestsResponse> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/friendRequests/own-friend-requests`,
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
