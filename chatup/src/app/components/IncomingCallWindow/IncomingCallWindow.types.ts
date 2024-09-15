import { IncomingCallData } from "@/context/AudioCallContext";

export interface IncomingCallWindowProps {
  incomingCallData: IncomingCallData | null;
  onAccept: () => void;
  onReject: () => void;
  onEnd: () => void;
  callDuration: number;
  isMuted: boolean;
  onMuteToggle: () => void;
}
