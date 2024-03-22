"use server";

import { UsersResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchOwnFriends(
  page: number = 1,
  offset: number = 10,
  search: string = ""
) {
  return fetchFromServer<UsersResponse>(
    `/api/current-user/friends?page=${page}&offset=${offset}&search=${search}`,
    {
      method: "GET",
    }
  );
}
