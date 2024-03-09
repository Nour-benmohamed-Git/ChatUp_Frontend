"use server";

import { UserResponse } from "@/types/User";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function updateCurrentUser(
  formData: FormData
): Promise<{ data: UserResponse }> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/current-user`,
    {
      method: "PATCH",
      body: formData,
      headers: headers,
    }
  );
  try {
    revalidateTag("current_user");
    return res.json();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update the current user.");
  }
}
