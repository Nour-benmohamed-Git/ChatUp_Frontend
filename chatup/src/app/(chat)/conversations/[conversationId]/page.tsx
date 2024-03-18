import { fetchConversationMessages } from "@/app/_actions/message-actions/fetch-conversation-messages";
import { getUserById } from "@/app/_actions/user-actions/get-user-by-id";
import SelectedConversation from "@/features/conversationsSectionFeatures/selectedConversation/SelectedConversation";
import { convertSearchParams } from "@/utils/helpers/sharedHelpers";
const Conversation = async ({
  params,
  searchParams,
}: {
  params: { conversationId: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const { conversationId } = params;
  
  const messagesPromise = fetchConversationMessages(conversationId);
  const userDataPromise = getUserById(searchParams?.secondMemberId as string);
  const [messages, userData] = await Promise.all([
    messagesPromise,
    userDataPromise,
  ]);

  return (
    <SelectedConversation
      conversationRelatedData={convertSearchParams({
        conversationId,
        ...searchParams,
      })}
      initialMessages={messages.data}
      userData={userData.data}
    />
  );
};
export default Conversation;
