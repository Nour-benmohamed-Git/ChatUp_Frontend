import { ConversationFilter } from "@/utils/constants/globals";
import { Dispatch, SetStateAction } from "react";

export interface PanelContentWrapperProps {
  children: React.ReactNode;
  height: string;
  hasSearchField?: boolean;
  paddingClass?: string;
  label?: string;
  setParamToSearch?: (search: string) => void;
  hasFilterBar?: boolean;
  activeFilter?: ConversationFilter;
  setActiveFilter?: Dispatch<SetStateAction<ConversationFilter>>;
}
