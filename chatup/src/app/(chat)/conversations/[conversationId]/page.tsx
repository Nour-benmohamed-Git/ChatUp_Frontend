import { getFilesByConversationId } from "@/app/_actions/conversationActions/getFilesByConversationId";
import { fetchConversationMessages } from "@/app/_actions/messageActions/fetchConversationMessages";
import { getUserById } from "@/app/_actions/userActions/getUserById";
import SelectedConversation from "@/features/conversationsSectionFeatures/selectedConversation/SelectedConversation";
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

  const [messages, userData, files] = await Promise.all([
    fetchConversationMessages(conversationId),
    getUserById(searchParams?.secondMemberId as string),
    getFilesByConversationId(conversationId),
  ]);

  if (messages.error || userData.error || files.error) {
    const message =
      messages.error?.message ||
      userData.error?.message ||
      files.error?.message;
    throw new CustomError(message);
  }
  return (
    <SelectedConversation
      conversationRelatedData={convertSearchParams({
        conversationId,
        ...searchParams,
      })}
      initialMessages={messages.data as Messages}
      userData={userData.data?.data as UserResponse}
      files={files.data?.data as File[]}
    />
  );
};
export default Conversation;
