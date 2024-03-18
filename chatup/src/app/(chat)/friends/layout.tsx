import { fetchFriendRequests } from "@/app/_actions/friend-request-actions/fetch-friend-requests";
import { fetchOwnFriends } from "@/app/_actions/user-actions/fetch-own-friends";
import FriendShipManagerContainer from "@/features/FriendShipManagerSectionFeature/friendsContainer/FriendsContainer";
import type { Metadata } from "next";
import "../../globals.css";
import { fetchCurrentUser } from "@/app/_actions/user-actions/fetch-current-user";
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
  const friendsPromise = await fetchOwnFriends(1, 10, "");
  const currentUserPromise = await fetchCurrentUser();

  const [friendRequests, friends, currentUser] = await Promise.all([
    friendRequestsPromise,
    friendsPromise,
    currentUserPromise,
  ]);
  return (
    <div className="h-screen md:col-span-11 grid md:grid-cols-12 bg-slate-700">
      <FriendShipManagerContainer
        initialFriendRequests={friendRequests}
        initialFriends={friends}
        currentUser={currentUser?.data}
      />
      {children}
    </div>
  );
}
