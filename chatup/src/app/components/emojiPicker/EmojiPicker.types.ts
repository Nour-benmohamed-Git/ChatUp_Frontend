export interface EmojiPickerProps {
  closeEmojiPicker: () => void;
  handleEmojiSelect: (params: { name: string; emoji: string }) => void;
  name: string;
}
