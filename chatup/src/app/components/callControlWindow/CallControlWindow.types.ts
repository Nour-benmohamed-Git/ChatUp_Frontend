import { ConversationCombinedType } from "@/types/ConversationCombinedType";

export interface CallControlWindowProps {
  combinedData?: ConversationCombinedType;
  handleRecall: () => void;
  handleDismiss: () => void;
  onEnd: () => void;
  callDuration: number;
  status?:
    | "calling"
    | "incoming"
    | "accepted"
    | "rejected"
    | "ended"
    | "recall";
  isMuted: boolean;
  onMuteToggle: () => void;
}
