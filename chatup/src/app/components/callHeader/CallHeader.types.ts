import { ICallInfo } from "@/context/AudioCallContext";

export interface CallHeaderProps {
  callInfo: ICallInfo | null;
  switchCamera: () => void;
  mediaSettings: { isVideoEnabled: boolean };
}
