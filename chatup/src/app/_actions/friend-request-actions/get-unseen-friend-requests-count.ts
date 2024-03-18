"use server";

import { cookies } from "next/headers";

export async function getUnseenFriendRequestsCount(): Promise<{ data: number }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/friendRequests/unseen-friend-requests-count`,
    { method: "GET", headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to get unseen friend requests count.");
  }
  return res.json();
}
