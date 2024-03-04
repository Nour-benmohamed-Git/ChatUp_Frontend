"use server";

import { UserResponse } from "@/types/User";
import { cookies } from "next/headers";

export async function getUserById(
  userId: string
): Promise<{ data: UserResponse }> {
  if (!userId) {
    return Promise.resolve({ data: {} as UserResponse });
  }
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/users/${userId}`,
    { method: "GET", headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user data.");
  }

  return res.json();
}
