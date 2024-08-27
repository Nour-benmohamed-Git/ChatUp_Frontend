import { ConversationCombinedType } from "@/types/ConversationCombinedType";

export interface ContactInfoProps {
  combinedData: ConversationCombinedType;
  onMessage: () => void;
  onAudioCall: () => void;
  onVideoCall: () => void;
  onBlock: () => void;
  onRemoveConversation: () => void;
}
