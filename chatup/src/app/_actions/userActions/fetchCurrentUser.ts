"use server";

import { UserResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchCurrentUser() {
  return fetchFromServer<{ data: UserResponse }>(`/api/current-user`, {
    method: "GET",
    next: { tags: ["currentUser"] },
  });
}
