"use server";

import { UsersResponse } from "@/types/User";
import { cookies } from "next/headers";

export async function fetchUsers(
  page: number = 1,
  offset: number = 10,
  search: string = ""
): Promise<UsersResponse> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/users?page=${page}&offset=${offset}&search=${search}`,
    { method: "GET", headers: headers }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch users.");
  }

  return res.json();
}
