import { ICallInfo } from "@/context/AudioCallContext";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import SimplePeer from "simple-peer";
import { Socket } from "socket.io-client";

export interface CallWindowProps {
  socket: Socket | null;
  currentUserId: number;
  peersRef: MutableRefObject<Map<number, SimplePeer.Instance>>;
  localStream: MutableRefObject<MediaStream | null>;
  callInfo: ICallInfo | null;
  setCallInfo: (value: SetStateAction<ICallInfo | null>) => void;
  userStreams: Map<number, MediaStream | null>;
  setUserStreams: Dispatch<SetStateAction<Map<number, MediaStream | null>>>;
  mediaSettings: {
    isMuted: boolean;
    isVideoEnabled: boolean;
    isSharingScreen: boolean;
    isNoiseReductionEnabled: boolean;
  };
  onRecall: () => void;
  onEnd: () => void;
  onAccept: () => void;
  onReject: () => void;
  onDismiss: () => void;
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  toggleNoiseReduction: () => Promise<void>;
  switchCamera: () => Promise<void>
  toggleScreenShare: () => Promise<void>
}
