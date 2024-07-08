"use server";

import { FriendRequestResponse } from "@/types/FriendRequest";
import { addFriendRequestSchema } from "@/utils/schemas/addFriendRequestSchema";
import { FetchError, fetchFromServer } from "../fetchFromServer";

export const addFriendRequest = async (
  currentState: { error: FetchError } | null = null,
  data: FormData
) => {
  const values = Object.fromEntries(data);
  const parsedData = addFriendRequestSchema.safeParse(values);
  if (parsedData.success) {
    return fetchFromServer<{ data: FriendRequestResponse }, any>(
      `/api/friendRequests`,
      {
        method: "POST",
        body: { email: data.get("email") },
      }
    );
  }
};
