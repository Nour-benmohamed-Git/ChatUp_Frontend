import { fetchConversations } from "@/app/_actions/conversationActions/fetchConversations";
import { fetchCurrentUser } from "@/app/_actions/userActions/fetchCurrentUser";
import ConversationListContainer from "@/features/conversationsSectionFeatures/conversationListContainer/ConversationListContainer";
import { ConversationsResponse } from "@/types/ChatSession";
import { UserResponse } from "@/types/User";
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
  const conversationsPromise = await fetchConversations();
  const currentUserPromise = await fetchCurrentUser();
  const [conversations, currentUser] = await Promise.all([
    conversationsPromise,
    currentUserPromise,
  ]);
  return (
    <div className="h-screen md:col-span-11 grid md:grid-cols-12 bg-slate-700">
      <ConversationListContainer
        initialConversations={conversations as ConversationsResponse}
        currentUser={
          (
            currentUser as {
              data: UserResponse;
            }
          ).data
        }
      />
      {children}
    </div>
  );
}
