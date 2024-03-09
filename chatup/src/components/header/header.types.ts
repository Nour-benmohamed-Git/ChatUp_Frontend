import { UserResponse } from "@/types/User";

export interface HeaderProps {
  actions: {
    label?: string;
    name: string;
    icon: JSX.Element;
  }[];
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
}
