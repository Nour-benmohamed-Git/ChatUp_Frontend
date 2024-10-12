import { ICallInfo } from "@/context/AudioCallContext";

export interface CallActionButtonsProps {
  callInfo: ICallInfo | null;
  mediaSettings: {
    isMuted: boolean;
    isVideoEnabled: boolean;
    isSharingScreen: boolean;
    isNoiseReductionEnabled: boolean;
  };
  onAccept: () => void;
  onDismiss: () => void;
  onRecall: () => void;
  onReject: () => void;
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  toggleNoiseReduction: () => void;
  toggleScreenShare: () => void;
  onEnd: () => void;
}
