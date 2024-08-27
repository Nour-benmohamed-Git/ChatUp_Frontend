import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import { UserResponse } from "@/types/User";

export interface HeaderProps {
  actions?: {
    label?: string;
    name: string;
    icon: JSX.Element;
  }[];
  toggleHandlers?: {
    [key: string]: { togglePanel: (event?: React.MouseEvent) => void };
  };
  label: "left_container" | "right_container";
  combinedData?: ConversationCombinedType
  menuActionList: {
    onClick: () => void;
    label: string;
    name: string;
    icon: JSX.Element;
  }[];
  title?: string;
}
