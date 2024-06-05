export interface FileViewerProps {
  files: any;
  onClose: () => void;
  messageDetails: {
    senderPicture?: string;
    senderName: string;
    timestamp?: number;
  };
}
