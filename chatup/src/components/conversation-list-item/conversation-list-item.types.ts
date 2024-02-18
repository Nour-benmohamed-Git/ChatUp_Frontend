import { ChatItem } from "@/types/ChatItem";
import { ChatSessionResponse } from "@/types/ChatSession";

export interface ConversationListItemProps {
  handleSelectChatItem: (data: ChatItem) => void;
  selectedChatItem: ChatItem;
  chatSession: ChatSessionResponse;
}
