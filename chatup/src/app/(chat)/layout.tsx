import SocketProvider from "@/context/socket-context";
import NavigationBar from "@/features/navigationBar/NavigationBar";
import { globals } from "@/utils/constants/globals";
import type { Metadata } from "next";
import { getUnseenConversationsCount } from "../_actions/conversation-actions/get-unseen-conversations-count";
import { getUnseenFriendRequestsCount } from "../_actions/friend-request-actions/get-unseen-friend-requests-count";
import { getCookie } from "../_actions/shared-actions/get-cookie";
import { fetchCurrentUser } from "../_actions/user-actions/fetch-current-user";
import "../globals.css";
export const metadata: Metadata = {
  title: "ChatUp | Conversations",
  description: "Conversations",
};

export default async function ConversationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getCookie(globals.tokenKey);
  const currentUserPromise = await fetchCurrentUser();
  const unseenConversationsCountPromise = await getUnseenConversationsCount();
  const unseenFriendRequestsCountPromise = await getUnseenFriendRequestsCount();
  
  const [currentUser, unseenConversationsCount,unseenFriendRequestsCount] = await Promise.all([
    currentUserPromise,
    unseenConversationsCountPromise,
    unseenFriendRequestsCountPromise
  ]);
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-12">
      <SocketProvider token={token}>
        <NavigationBar
          currentUser={currentUser?.data}
          initialUnseenConversationsCount={unseenConversationsCount?.data}
          initialUnseenFriendRequestsCount={unseenFriendRequestsCount?.data}

        />
        {children}
      </SocketProvider>
    </div>
  );
}
