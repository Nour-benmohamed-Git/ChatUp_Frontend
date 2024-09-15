import { ConversationsResponse } from "@/types/ChatSession";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";

export interface SelectedConversationProps {
  conversationRelatedData: {
    [key: string]: number | boolean | string | undefined;
  };
  combinedData: ConversationCombinedType;
  initialConversations: ConversationsResponse;
}
