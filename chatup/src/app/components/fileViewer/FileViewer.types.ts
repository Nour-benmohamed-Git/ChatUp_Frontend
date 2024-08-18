export interface FileViewerProps {
  files: any;
  onClose: () => void;
  messageDetails?: {
    senderId?: number;
    senderPicture?: string;
    senderName: string;
    timestamp?: number;
  };
  initialSelectedFileIndex?: number;
}
