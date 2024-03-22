"use server";

import { UserResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function getUserById(
  userId: string
) {
return fetchFromServer<{ data: UserResponse }>(
    `/api/users/${userId}`,
    {
      method: "GET",
    }
  );
}
