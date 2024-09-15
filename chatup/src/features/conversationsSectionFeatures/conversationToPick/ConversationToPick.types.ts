import { ConversationResponse } from "@/types/ChatSession";

export interface ConversationToPickProps {
  conversation: ConversationResponse;
  onCheckChange: () => void;
  isChecked: boolean;
}
