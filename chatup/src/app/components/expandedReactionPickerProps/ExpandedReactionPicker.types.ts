import { MenuPosition } from "@/utils/constants/globals";
import { RefObject } from "react";

export interface ExpandedReactionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddReaction: (params: { name: string; emoji: string }) => void;
  buttonRef: RefObject<HTMLDivElement>;
  position?: MenuPosition;
  reactionSelectorPosition?: {
    x: number;
    y: number;
  };
}
