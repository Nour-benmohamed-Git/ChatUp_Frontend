import { fetchFriends } from "@/app/_actions/friendActions/fetchFriends";
import { fetchFriendRequests } from "@/app/_actions/friendRequestActions/fetchFriendRequests";
import { fetchCurrentUser } from "@/app/_actions/userActions/fetchCurrentUser";
import FriendShipManagerContainer from "@/features/FriendShipManagerSectionFeature/friendsContainer/FriendsContainer";
import { FriendRequestsResponse } from "@/types/FriendRequest";
import { UserResponse, UsersResponse } from "@/types/User";
import { CustomError } from "@/utils/config/exceptions";
import type { Metadata } from "next";
import "../../globals.css";
export const metadata: Metadata = {
  title: "ChatUp | Friend Ship Manager",
  description: "Friend Ship Manager",
};

export default async function FriendsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUser, friendRequests, friends] = await Promise.all([
    fetchCurrentUser(),
    fetchFriendRequests(),
    fetchFriends(),
  ]);

  if (currentUser.error || friendRequests.error || friends.error) {
    const message =
      currentUser.error?.message ||
      friendRequests.error?.message ||
      friends.error?.message;

    throw new CustomError(message);
  }
  return (
    <div className="h-full w-full col-span-1 md:col-span-11 md:grid md:grid-cols-12">
      <FriendShipManagerContainer
        initialFriendRequests={friendRequests.data as FriendRequestsResponse}
        initialFriends={friends.data as UsersResponse}
        currentUser={currentUser.data?.data as UserResponse}
      />
      {children}
    </div>
  );
}
