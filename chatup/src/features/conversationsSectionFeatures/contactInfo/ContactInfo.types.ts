import { UserResponse } from "@/types/User";

export interface ContactInfoProps {
  userData: UserResponse;
  conversationId: number;
  lastSeen: string;
  onMessage: () => void;
  onAudioCall: () => void;
  onVideoCall: () => void;
  onBlock: () => void;
  onRemoveConversation: () => void;
}
