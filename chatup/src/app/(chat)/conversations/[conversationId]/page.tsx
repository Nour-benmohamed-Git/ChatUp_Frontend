import { getFilesByConversationId } from "@/app/_actions/conversationActions/getFilesByConversationId";
import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import { getUserById } from "@/app/_actions/userActions/getUserById";
import SelectedConversation from "@/features/conversationsSectionFeatures/selectedConversation/SelectedConversation";
import { Messages } from "@/types/Message";
import { UserResponse } from "@/types/User";
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

  const filesPromise = getFilesByConversationId(conversationId);
  const userDataPromise = getUserById(searchParams?.secondMemberId as string);
  const [messages, userData, files] = await Promise.all([
    messagesPromise,
    userDataPromise,
    filesPromise,
  ]);

  return (
    <SelectedConversation
      conversationRelatedData={convertSearchParams({
        conversationId,
        ...searchParams,
      })}
      initialMessages={messages as Messages}
      userData={
        (
          userData as {
            data: UserResponse;
          }
        ).data
      }
      files={
        (
          files as {
            data: File[];
          }
        ).data
      }
    />
  );
};
export default Conversation;
