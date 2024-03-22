"use server";

import { addFriendRequestSchema } from "@/utils/schemas/add-friend-request-schema";
import { createSafeActionClient } from "next-safe-action";
import { fetchFromServer } from "../fetchFromServer";

export const action = createSafeActionClient();
export const addFriendRequest = action(addFriendRequestSchema, async (data) => {
  return fetchFromServer(`/api/friendRequests`, { method: "POST", body: data });
});
