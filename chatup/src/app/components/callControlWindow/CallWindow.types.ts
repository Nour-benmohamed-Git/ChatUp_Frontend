import { ICallInfo } from "@/context/AudioCallContext";
import { SetStateAction } from "react";
import { Socket } from "socket.io-client";

export interface CallWindowProps {
  socket: Socket | null;
  callInfo?: ICallInfo;
  setCallInfo: (value: SetStateAction<ICallInfo | undefined>) => void;
  handleRecall: () => void;
  handleDismiss: () => void;
  onEnd: () => void;
  onAccept: () => void;
  onReject: () => void;
  isMuted: boolean;
  onMuteToggle: () => void;
}
