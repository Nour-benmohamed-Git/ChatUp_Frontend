import { ICallInfo } from "@/context/AudioCallContext";
import { MutableRefObject, SetStateAction } from "react";
import SimplePeer from "simple-peer";
import { Socket } from "socket.io-client";

export interface CallWindowProps {
  socket: Socket | null;
  currentUserId: number;
  peersRef: MutableRefObject<Map<number, SimplePeer.Instance>>;
  userAudioRefs: MutableRefObject<Map<number, HTMLAudioElement>>;
  callDuration: number;
  callInfo: ICallInfo | null;
  isMuted: boolean;
  localStreamRef: MutableRefObject<MediaStream | null>;
  setCallInfo: (value: SetStateAction<ICallInfo | null>) => void;
  startCallTimer: () => void;
  onRecall: () => void;
  onEnd: () => void;
  onAccept: () => void;
  onReject: () => void;
  onDismiss: () => void;

  onMuteToggle: () => void;
}
