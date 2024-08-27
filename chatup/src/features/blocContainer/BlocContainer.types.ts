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
  label: "left_container" | "right_container";
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
}
