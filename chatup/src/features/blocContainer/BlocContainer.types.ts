import { ConversationCombinedType } from "@/types/ConversationCombinedType";

export interface BlocContainerProps {
  children: React.ReactNode;
  actions?: {
    label?: string;
    name: string;
    icon: JSX.Element;
  }[];
  hasChatControlPanel?: boolean;
  cssClass?: string;
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
  conversationRelatedData?: {
    [key: string]: number | boolean | string | undefined;
  };
  title?: string;
  handleBack?: () => void;
  startAudioCall: () => void
}
