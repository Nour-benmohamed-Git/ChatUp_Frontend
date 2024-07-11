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

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [conversations, currentUser] = await Promise.all([
    fetchConversations(),
    fetchCurrentUser(),
  ]);

  if (conversations.error || currentUser.error) {
    const message = conversations.error?.message || currentUser.error?.message;
    throw new CustomError(message);
  }
  return (
    <div className="h-screen md:col-span-11 grid md:grid-cols-12 bg-slate-700">
      <ConversationListContainer
        initialConversations={conversations.data as ConversationsResponse}
        currentUser={currentUser.data?.data as UserResponse}
      />
      {children}
    </div>
  );
}
