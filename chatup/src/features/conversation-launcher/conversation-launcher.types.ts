export interface ConversationLauncherProps {
  label: string;
  onSelectChat: (id: number) => void
  togglePanel: (event?: React.MouseEvent) => void;
}
