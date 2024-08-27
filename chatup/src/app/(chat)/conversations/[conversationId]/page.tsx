import { getConversation } from "@/app/_actions/conversationActions/getConversation";
import { fetchFriends } from "@/app/_actions/friendActions/fetchFriends";
import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import { getUserById } from "@/app/_actions/userActions/getUserById";
import { MessageProvider } from "@/context/MessageContext";
import SelectedConversation from "@/features/conversationsSectionFeatures/selectedConversation/SelectedConversation";
import { ConversationResponse } from "@/types/ChatSession";
import { Message, Messages } from "@/types/Message";
import { UsersResponse } from "@/types/User";
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

  const [conversation, messages, friends] = await Promise.all([
    getConversation(conversationId),
    fetchConversationMessages(conversationId),
    fetchFriends(),
  ]);

  if (conversation.error || messages.error || friends.error) {
    const message =
      conversation.error?.message ||
      messages.error?.message ||
      friends.error?.message;
    throw new CustomError(message);
  }

  console.log("hello from page");

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
      initialMessages={messages.data?.data as Message[]}
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
        initialMessages={messages.data as Messages}
        initialFriends={friends.data as UsersResponse}
        combinedData={combinedData}
      />
    </MessageProvider>
  );
};
export default Conversation;
