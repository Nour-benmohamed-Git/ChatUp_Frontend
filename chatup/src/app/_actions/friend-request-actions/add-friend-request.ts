"use server";

import { addFriendRequestSchema } from "@/utils/schemas/add-friend-request-schema";
import { createSafeActionClient } from "next-safe-action";
import { cookies } from "next/headers";

export const action = createSafeActionClient();
export const addFriendRequest = action(addFriendRequestSchema, async (data) => {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/notifications`,
    { method: "POST", body: JSON.stringify(data), headers: headers }
  );
  try {
    return res.json();
  } catch (error) {
    throw new Error("Failed to accept the friend request.");
  }
});
