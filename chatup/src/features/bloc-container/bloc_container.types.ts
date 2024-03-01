import { UserResponse } from "@/types/User";

export interface BlocContainerProps {
  children: React.ReactNode;
  actions: {
    label?: string;
    name: string;
    icon: JSX.Element;
  }[];
  height: string;
  hasSearchField?: boolean;
  hasChatControlPanel?: boolean;
  paddingClass?: string;
  toggleHandlers: {
    [key: string]: { togglePanel: (event?: React.MouseEvent) => void };
  };
  label: "chat_list_sidebar" | "chat_conversation";
  userData?: UserResponse;
  menuActionList: {
    onClick: () => void;
    label: string;
    name: string;
    icon: JSX.Element;
  }[];
  conversationRelatedData?: { [key: string]: number | boolean | string | undefined };
}
