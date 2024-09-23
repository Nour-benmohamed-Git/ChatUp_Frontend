import { ConversationCombinedType } from "@/types/ConversationCombinedType";

export interface HeaderProps {
  actions?: {
    label?: string;
    name: string;
    icon: JSX.Element;
  }[];
  toggleHandlers?: {
    [key: string]: { togglePanel: (event?: React.MouseEvent) => void };
  };
  label?: "archived" | "selected_conversation";
  combinedData?: ConversationCombinedType;
  menuActionList: {
    onClick: () => void;
    label: string;
    name: string;
    icon: JSX.Element;
  }[];
  title?: string;
  handleBack?: () => void;
}
