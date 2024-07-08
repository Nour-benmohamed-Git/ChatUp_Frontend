import { UserResponse } from "@/types/User";

export interface ContactInfoProps {
  userData: UserResponse;
  files: File[];
  lastSeen: string;
  onMessage: () => void;
  onAudioCall: () => void;
  onVideoCall: () => void;
  onBlock: () => void;
  onRemoveConversation: () => void;
}
