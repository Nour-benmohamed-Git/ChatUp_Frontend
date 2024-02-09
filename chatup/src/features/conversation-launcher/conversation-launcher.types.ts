export interface ConversationLauncherProps {
  label: string;
  handleSelectChatItem: (data: {
    chatId: number;
    secondMemberId?: number;
    deletedByCurrentUser?: boolean;
  }) => void;
  togglePanel: (event?: React.MouseEvent) => void;
}
