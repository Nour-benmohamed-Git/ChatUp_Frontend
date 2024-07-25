import { fetchSuggestions } from "@/app/_actions/friendSuggestionActions/fetchSuggestions";
import SendFriendRequest from "@/features/sendFriendRequest/SendFriendRequest";
import { FriendSuggestionsResponse } from "@/types/Suggestions";
import { CustomError } from "@/utils/config/exceptions";
import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "ChatUp | Add Friend",
  description: "Add Friend",
};

export default async function AddFriendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const friendSuggestions = await fetchSuggestions();

  if (friendSuggestions.error) {
    const message = friendSuggestions.error?.message;
    throw new CustomError(message);
  }
  // console.log("friendSuggestions", friendSuggestions);
  return (
    <div className="h-full w-full col-span-1 md:col-span-11 md:grid md:grid-cols-12">
      <SendFriendRequest
        initialFriendSuggestions={
          friendSuggestions.data as FriendSuggestionsResponse
        }
      />
      {children}
    </div>
  );
}
