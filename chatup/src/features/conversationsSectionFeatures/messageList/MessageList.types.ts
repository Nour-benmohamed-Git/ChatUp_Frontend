import { ConversationResponse } from "@/types/ChatSession";
import { Messages } from "@/types/Message";
import { UsersResponse } from "@/types/User";
import { RefObject } from "react";

export interface MessageListProps {
  conversation: ConversationResponse;
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
  initialMessages: Messages;
  messageListRef: RefObject<HTMLDivElement>;
  paramToSearch: string;
  searchResults: number[];
  setSearchResults: (result: number[]) => void;
  currentSearchIndex: number;
  setCurrentSearchIndex: (result: number) => void;
  initialFriends: UsersResponse;
}
