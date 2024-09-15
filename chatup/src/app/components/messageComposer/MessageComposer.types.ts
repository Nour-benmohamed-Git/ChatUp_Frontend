
export interface MessageComposerProps {
  handleSubmitForm: () => Promise<void>;
  openEmojiPicker: () => void;
  handleUploadDocuments: () => void;
}
