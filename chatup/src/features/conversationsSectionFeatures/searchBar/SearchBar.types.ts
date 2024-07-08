import { Dispatch, SetStateAction } from "react";

export interface SearchBarProps {
  setParamToSearch: (param: string) => void;
  searchResults: number[];
  currentSearchIndex: number;
  setCurrentSearchIndex: Dispatch<SetStateAction<number>>;
}
