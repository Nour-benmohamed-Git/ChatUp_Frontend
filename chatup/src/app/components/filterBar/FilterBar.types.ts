import { ConversationFilter } from "@/utils/constants/globals";
import { Dispatch, SetStateAction } from "react";

export interface FilterBarProps {
  activeFilter: ConversationFilter;
  setActiveFilter: Dispatch<SetStateAction<ConversationFilter>>;
}
