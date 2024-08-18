import { fetchConversations } from "@/app/_actions/conversationActions/fetchConversations";
import { fetchCurrentUser } from "@/app/_actions/userActions/fetchCurrentUser";
import ConversationListContainer from "@/features/conversationsSectionFeatures/conversationListContainer/ConversationListContainer";
import { ConversationsResponse } from "@/types/ChatSession";
import { UserResponse } from "@/types/User";
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
  const [currentUser, conversations,] = await Promise.all([
    fetchCurrentUser(),
    fetchConversations(),

  ]);

  if (currentUser.error || conversations.error ) {
    const message =
      currentUser.error?.message ||
      conversations.error?.message 
    throw new CustomError(message);
  }
  return (
    <div className="h-full w-full col-span-1 md:col-span-11 md:grid md:grid-cols-12">
      <ConversationListContainer
        initialConversations={conversations.data as ConversationsResponse}
        currentUser={currentUser.data?.data as UserResponse}
      />
      {children}
    </div>
  );
}
