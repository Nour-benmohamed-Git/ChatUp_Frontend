import { OnlineUsersProvider } from "@/context/OnlineUsersContext";
import SocketProvider from "@/context/SocketContext";
import NavigationBar from "@/features/navigationBar/NavigationBar";
import { UserResponse } from "@/types/User";
import { CustomError } from "@/utils/config/exceptions";
import type { Metadata } from "next";
import { fetchConversations } from "../_actions/conversationActions/fetchConversations";
import { fetchFriendRequests } from "../_actions/friendRequestActions/fetchFriendRequests";
import { fetchCurrentUser } from "../_actions/userActions/fetchCurrentUser";
import "../globals.css";

export const metadata: Metadata = {
  title: "ChatUp | Conversations",
  description: "Conversations",
};

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUser, conversations, friendRequests] = await Promise.all([
    fetchCurrentUser(),
    fetchConversations(),
    fetchFriendRequests(),
  ]);

  if (currentUser.error || conversations.error || friendRequests.error) {
    const message =
      currentUser.error?.message ||
      conversations.error?.message ||
      friendRequests.error?.message;
    throw new CustomError(message);
  }

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-12">
      <SocketProvider
        currentUserId={(currentUser.data?.data as UserResponse).id}
      >
        <OnlineUsersProvider>
          <NavigationBar
            currentUser={currentUser.data?.data as UserResponse}
            initialUnseenConversationsCount={
              conversations.data?.unseenCount as number
            }
            initialUnseenFriendRequestsCount={
              friendRequests.data?.unseenCount as number
            }
          />
          {children}
        </OnlineUsersProvider>
      </SocketProvider>
    </div>
  );
}
