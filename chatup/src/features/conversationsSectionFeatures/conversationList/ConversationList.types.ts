import { ConversationsResponse } from "@/types/ChatSession";
import { UserResponse } from "@/types/User";
import { ConversationFilter } from "@/utils/constants/globals";
import { Dispatch, SetStateAction } from "react";
export interface ConversationListProps {
  label: string;
  initialConversations: ConversationsResponse;
  currentUser: UserResponse;
  activeFilter: ConversationFilter;
  setActiveFilter: Dispatch<SetStateAction<ConversationFilter>>;
}
