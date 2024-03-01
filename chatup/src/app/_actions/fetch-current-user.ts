"use server";

import { UserResponse } from "@/types/User";
import { cookies } from "next/headers";

export async function fetchCurrentUser(): Promise<{ data: UserResponse }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/current-user`,
    { method: "GET", headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch current user.");
  }

  return res.json();
}
