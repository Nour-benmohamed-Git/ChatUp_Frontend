import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import { Messages } from "@/types/Message";
import { UsersResponse } from "@/types/User";

export interface MessageListProps {
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
  combinedData: ConversationCombinedType
  initialMessages: Messages;
  paramToSearch: string;
  searchResults: number[];
  setSearchResults: (result: number[]) => void;
  currentSearchIndex: number;
  setCurrentSearchIndex: (result: number) => void;
  initialFriends: UsersResponse;
}
