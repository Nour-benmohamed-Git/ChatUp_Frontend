import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import { Message } from "@/types/Message";

export interface SystemMessageProps {
  combinedData: ConversationCombinedType;
  onViewInfo?: () => void;
  onAddMembers?: () => void;
}
