import { ConversationResponse } from "@/types/ChatSession";
import { Messages } from "@/types/Message";
import { UserResponse } from "@/types/User";

export interface SelectedConversationProps {
  conversation: ConversationResponse;
  conversationRelatedData: {
    [key: string]: number | boolean | string | undefined;
  };
  initialMessages: Messages;
  userData: UserResponse;
}
