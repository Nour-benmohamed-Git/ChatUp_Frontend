import { fetchFriendRequests } from "@/app/_actions/friendRequestActions/fetchFriendRequests";
import { fetchCurrentUser } from "@/app/_actions/userActions/fetchCurrentUser";
import { fetchOwnFriends } from "@/app/_actions/userActions/fetchOwnFriends";
import FriendShipManagerContainer from "@/features/FriendShipManagerSectionFeature/friendsContainer/FriendsContainer";
import { FriendRequestsResponse } from "@/types/FriendRequest";
import { UserResponse, UsersResponse } from "@/types/User";
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
  const friendRequestsPromise = await fetchFriendRequests();
  const friendsPromise = await fetchOwnFriends();
  const currentUserPromise = await fetchCurrentUser();

  const [friendRequests, friends, currentUser] = await Promise.all([
    friendRequestsPromise,
    friendsPromise,
    currentUserPromise,
  ]);
  return (
    <div className="h-screen md:col-span-11 grid md:grid-cols-12 bg-slate-700">
      <FriendShipManagerContainer
        initialFriendRequests={friendRequests as FriendRequestsResponse}
        initialFriends={friends as UsersResponse}
        currentUser={(currentUser as { data: UserResponse })?.data}
      />
      {children}
    </div>
  );
}
