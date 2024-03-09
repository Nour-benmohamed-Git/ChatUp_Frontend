import { UserResponse } from "@/types/User";

export interface BlocContainerProps {
  children: React.ReactNode;
  actions: {
    label?: string;
    name: string;
    icon: JSX.Element;
  }[];
  hasSearchField?: boolean;
  hasChatControlPanel?: boolean;
  cssClass?: string;
  toggleHandlers: {
    [key: string]: { togglePanel: (event?: React.MouseEvent) => void };
  };
  label: "conversation_list_sidebar" | "conversation";
  userData?: UserResponse;
  menuActionList: {
    onClick: () => void;
    label: string;
    name: string;
    icon: JSX.Element;
  }[];
  conversationRelatedData?: {
    [key: string]: number | boolean | string | undefined;
  };
}
