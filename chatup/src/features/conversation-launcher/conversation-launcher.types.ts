export interface ConversationLauncherProps {
  label: string;
  handleSelectChatItem: (data: {
    chatId: number;
    secondMemberId?: number;
}) => void
  togglePanel: (event?: React.MouseEvent) => void;
}
