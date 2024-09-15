import { ConversationsResponse } from "@/types/ChatSession";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";

export interface MessageListProps {
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
  combinedData: ConversationCombinedType;
  paramToSearch: string;
  searchResults: number[];
  setSearchResults: (result: number[]) => void;
  currentSearchIndex: number;
  setCurrentSearchIndex: (result: number) => void;
  initialConversations: ConversationsResponse;
}
