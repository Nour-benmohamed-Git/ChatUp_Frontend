import { Messages } from "@/types/Message";
import { RefObject } from "react";

export interface MessageListProps {
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
  
}
