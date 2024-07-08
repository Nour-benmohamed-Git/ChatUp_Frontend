"use server";

import { UserResponse } from "@/types/User";
import { updateProfileSchema } from "@/utils/schemas/updateProfileSchema";
import { FetchError, fetchFromServer } from "../fetchFromServer";

export const updateCurrentUser = async (
  currentState: { error: FetchError } | null = null,
  data: FormData
) => {
  const values = Object.fromEntries(data);
  const parsedData = updateProfileSchema.safeParse(values);

  if (parsedData.success) {
    return fetchFromServer<{ data: UserResponse }, FormData>(
      `/api/current-user`,
      {
        method: "PATCH",
        body: data,
      }
    );
  }
};
