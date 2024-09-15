import { fetchConversations } from "@/app/_actions/conversationActions/fetchConversations";
import { getConversation } from "@/app/_actions/conversationActions/getConversation";
import { getUserById } from "@/app/_actions/userActions/getUserById";
import { MessageProvider } from "@/context/MessageContext";
import SelectedConversation from "@/features/conversationsSectionFeatures/selectedConversation/SelectedConversation";
import {
  ConversationResponse,
  ConversationsResponse,
} from "@/types/ChatSession";
import { CustomError } from "@/utils/config/exceptions";
import {
  convertSearchParams,
  createConversationCombinedData,
} from "@/utils/helpers/sharedHelpers";
import { cookies } from "next/headers";
const Conversation = async ({
  params,
  searchParams,
}: {
  params: { conversationId: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  let userData = null;
  const { conversationId } = params;
  const currentUserId = cookies().get("currentUserId")?.value;

  const [conversation, conversations] = await Promise.all([
    getConversation(conversationId),
    fetchConversations(),
  ]);

  if (conversation.error || conversations.error) {
    const message =
      conversation.error?.message ||
      conversations.error?.message;
    throw new CustomError(message);
  }


  if (searchParams?.secondMemberId) {
    userData = await getUserById(searchParams?.secondMemberId as string);

    if (userData.error) {
      throw new CustomError(userData.error.message);
    }
  }

  const combinedData = createConversationCombinedData(
    conversation.data?.data as ConversationResponse,
    userData?.data?.data,
    currentUserId
  );

  return (
    <MessageProvider
      conversationRelatedData={convertSearchParams({
        conversationId,
        seen: `${conversation.data?.data?.seen}`,
        deletedByCurrentUser: `${conversation.data?.data?.deletedByCurrentUser}`,
        currentUserId: currentUserId,
        ...searchParams,
      })}
    >
      <SelectedConversation
        conversationRelatedData={convertSearchParams({
          conversationId,
          seen: `${conversation.data?.data?.seen}`,
          deletedByCurrentUser: `${conversation.data?.data?.deletedByCurrentUser}`,
          ...searchParams,
        })}
        initialConversations={conversations.data as ConversationsResponse}
        combinedData={combinedData}
      />
    </MessageProvider>
  );
};
export default Conversation;
