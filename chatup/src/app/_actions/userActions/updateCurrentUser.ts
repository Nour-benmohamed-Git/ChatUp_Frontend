"use server";

import { UserResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function updateCurrentUser(formData: FormData) {
return fetchFromServer<{ data: UserResponse }, FormData>(
    `/api/current-user`,
    { method: "PATCH", body: formData },
    { tag: "currentUser" }
  );
}
