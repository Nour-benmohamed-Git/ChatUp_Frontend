import SocketProvider from "@/context/SocketContext";
import NavigationBar from "@/features/navigationBar/NavigationBar";
import { UserResponse } from "@/types/User";
import { CustomError } from "@/utils/config/exceptions";
import type { Metadata } from "next";
import { fetchConversations } from "../_actions/conversationActions/fetchConversations";
import { fetchCurrentUser } from "../_actions/userActions/fetchCurrentUser";
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
  const [currentUser, conversations] = await Promise.all([
    fetchCurrentUser(),
    fetchConversations(),
  ]);
  if (currentUser.error || conversations.error) {
    const message = currentUser.error?.message || conversations.error?.message;
    throw new CustomError(message);
  }
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-12">
      <SocketProvider>
        <NavigationBar
          currentUser={currentUser.data?.data as UserResponse}
          initialUnseenConversationsCount={
            conversations.data?.unseenCount as number
          }
          initialUnseenFriendRequestsCount={6}
        />
        {children}
      </SocketProvider>
    </div>
  );
}
