import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import { getUserById } from "@/app/_actions/userActions/getUserById";
import SelectedConversation from "@/features/conversationsSectionFeatures/selectedConversation/SelectedConversation";
import { Messages } from "@/types/Message";
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
      initialMessages={(messages as Messages).data}
      userData={userData.data}
    />
  );
};
export default Conversation;
