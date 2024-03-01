import { fetchConversationMessages } from "@/app/_actions/fetch-conversation-messages";
import { getUserById } from "@/app/_actions/get-user-by-id";
import SelectedConversation from "@/features/selected-conversation/selected-conversation";
import { convertSearchParams } from "@/utils/helpers/sharedHelpers";
const Main = async ({
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
export default Main;
