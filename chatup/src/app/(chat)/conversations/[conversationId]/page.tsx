import { getConversationById } from "@/app/_actions/conversationActions/getConversationById";
import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import { getUserById } from "@/app/_actions/userActions/getUserById";
import SelectedConversation from "@/features/conversationsSectionFeatures/selectedConversation/SelectedConversation";
import { ConversationResponse } from "@/types/ChatSession";
import { Messages } from "@/types/Message";
import { UserResponse } from "@/types/User";
import { CustomError } from "@/utils/config/exceptions";
import { convertSearchParams } from "@/utils/helpers/sharedHelpers";
const Conversation = async ({
  params,
  searchParams,
}: {
  params: { conversationId: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const { conversationId } = params;
  const [conversation, messages, userData] = await Promise.all([
    getConversationById(conversationId),
    fetchConversationMessages(conversationId),
    getUserById(searchParams?.secondMemberId as string),
  ]);

  if (messages.error || userData.error) {
    const message = messages.error?.message || userData.error?.message;
    throw new CustomError(message);
  }
  return (
    <SelectedConversation
      conversation={conversation.data?.data as ConversationResponse}
      conversationRelatedData={convertSearchParams({
        conversationId,
        ...searchParams,
      })}
      initialMessages={messages.data as Messages}
      userData={userData.data?.data as UserResponse}
    />
  );
};
export default Conversation;
