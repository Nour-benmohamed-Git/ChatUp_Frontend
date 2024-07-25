"use server";

import { FriendRequestsResponse } from "@/types/FriendRequest";
import { fetchFromServer } from "../fetchFromServer";

export async function fetchFriendRequests(
  page: number = 1,
  offset: number = 10,
  search: string = ""
) {
  return fetchFromServer<FriendRequestsResponse>(
    `/api/friend-requests?page=${page}&offset=${offset}&search=${search}`,
    { method: "GET", next: { tags: ["requests"] } }
  );
}
