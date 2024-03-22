"use server";

import { UsersResponse } from "@/types/User";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchUsers(
  page: number = 1,
  offset: number = 10,
  search: string = ""
) {
  return fetchFromServer<UsersResponse>(
    `/api/users?page=${page}&offset=${offset}&search=${search}`,
    {
      method: "GET",
    }
  );
}
