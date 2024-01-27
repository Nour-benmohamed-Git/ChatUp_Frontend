export interface HeaderProps {
  actions: {
    label?: string;
    name: string;
    icon: JSX.Element;
  }[];
  toggleHandlers: {
    [key: string]: { togglePanel: (event?: React.MouseEvent) => void };
  };
  conversationData?: string;
  label: "chat_list_sidebar" | "chat_conversation";
}
