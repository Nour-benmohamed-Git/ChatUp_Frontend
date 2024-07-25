"use server";

import { FriendRequestResponse } from "@/types/FriendRequest";
import { sendFriendRequestSchema } from "@/utils/schemas/sendFriendRequestSchema";
import { FetchError, fetchFromServer } from "../fetchFromServer";

export const sendFriendRequest = async (
  currentState: { error: FetchError } | null = null,
  data: FormData
) => {
  const values = Object.fromEntries(data);
  const parsedData = sendFriendRequestSchema.safeParse(values);

  if (!parsedData.success) {
    console.error("Validation errors:", parsedData.error.issues); // Debugging line
  }
  if (parsedData.success) {
    const body: { email?: string; phone?: string } = {};
    const email = data.get("email");
    const phone = data.get("phone");

    if (email) {
      body.email = email.toString();
    } else if (phone) {
      body.phone = phone.toString();
    }

    return fetchFromServer<
      { data: FriendRequestResponse },
      {
        email?: string;
        phone?: string;
      }
    >(
      `/api/friend-requests`,
      {
        method: "POST",
        body: body,
      },
      { tag: "suggestions" }
    );
  }
};
