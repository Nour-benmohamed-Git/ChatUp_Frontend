import { fetchConversations } from "@/app/_actions/conversationActions/fetchConversations";
import { fetchFriends } from "@/app/_actions/friendActions/fetchFriends";
import { fetchCurrentUser } from "@/app/_actions/userActions/fetchCurrentUser";
import { ChatSessionProvider } from "@/context/ChatSessionContext";
import ConversationListContainer from "@/features/conversationsSectionFeatures/conversationListContainer/ConversationListContainer";
import { ConversationResponse, ConversationsResponse } from "@/types/ChatSession";
import { UserResponse, UsersResponse } from "@/types/User";
import { CustomError } from "@/utils/config/exceptions";
import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "ChatUp | Chat Box",
  description: "Chat Box",
};

export default async function ConversationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUser, conversations, friends] = await Promise.all([
    fetchCurrentUser(),
    fetchConversations(),
    fetchFriends(),
  ]);

  if (currentUser.error || conversations.error || friends.error) {
    const message =
      currentUser.error?.message ||
      conversations.error?.message ||
      friends.error?.message;
    throw new CustomError(message);
  }
  return (
    <ChatSessionProvider
     initialChatSessions={conversations.data?.data as ConversationResponse[]}
    >
      <div className="h-full w-full col-span-1 md:col-span-11 md:grid md:grid-cols-12">
        <ConversationListContainer
          initialConversations={conversations.data as ConversationsResponse}
          currentUser={currentUser.data?.data as UserResponse}
          initialFriends={friends.data as UsersResponse}
        />
        {children}
      </div>
    </ChatSessionProvider>
  );
}
