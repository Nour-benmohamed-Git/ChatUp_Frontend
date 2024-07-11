import { fetchFriendRequests } from "@/app/_actions/friendRequestActions/fetchFriendRequests";
import { fetchCurrentUser } from "@/app/_actions/userActions/fetchCurrentUser";
import { fetchOwnFriends } from "@/app/_actions/userActions/fetchOwnFriends";
import FriendShipManagerContainer from "@/features/FriendShipManagerSectionFeature/friendsContainer/FriendsContainer";
import { FriendRequestsResponse } from "@/types/FriendRequest";
import { UserResponse, UsersResponse } from "@/types/User";
import type { Metadata } from "next";
import "../../globals.css";
import { CustomError } from "@/utils/config/exceptions";
export const metadata: Metadata = {
  title: "ChatUp | Friend Ship Manager",
  description: "Friend Ship Manager",
};

export default async function FriendsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [friendRequests, friends, currentUser] = await Promise.all([
    fetchFriendRequests(),
    fetchOwnFriends(),
    fetchCurrentUser(),
  ]);

  if (friendRequests.error || friends.error || currentUser.error) {
    const message =
      friendRequests.error?.message ||
      friendRequests.error?.message ||
      currentUser.error?.message;
    throw new CustomError(message);
  }
  return (
    <div className="h-screen md:col-span-11 grid md:grid-cols-12 bg-slate-700">
      <FriendShipManagerContainer
        initialFriendRequests={friendRequests.data as FriendRequestsResponse}
        initialFriends={friends.data as UsersResponse}
        currentUser={currentUser.data?.data as UserResponse}
      />
      {children}
    </div>
  );
}
