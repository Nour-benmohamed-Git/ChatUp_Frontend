import SocketProvider from "@/context/SocketContext";
import NavigationBar from "@/features/navigationBar/NavigationBar";
import { ConversationsResponse } from "@/types/ChatSession";
import { UserResponse } from "@/types/User";
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
  const currentUserPromise = await fetchCurrentUser();
  const conversationsPromise = await fetchConversations();

  const [currentUser, conversations] = await Promise.all([
    currentUserPromise,
    conversationsPromise,
    ,
  ]);
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-12">
      <SocketProvider>
        <NavigationBar
          currentUser={(currentUser as { data: UserResponse })?.data}
          initialUnseenConversationsCount={
            (conversations as ConversationsResponse).unseenCount
          }
          initialUnseenFriendRequestsCount={6}
        />
        {children}
      </SocketProvider>
    </div>
  );
}
