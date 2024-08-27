import { ConversationResponse } from "@/types/ChatSession";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import { Messages } from "@/types/Message";
import { UserResponse, UsersResponse } from "@/types/User";

export interface SelectedConversationProps {
  conversationRelatedData: {
    [key: string]: number | boolean | string | undefined;
  };
  initialMessages: Messages;
  combinedData: ConversationCombinedType;
  initialFriends: UsersResponse;
}
