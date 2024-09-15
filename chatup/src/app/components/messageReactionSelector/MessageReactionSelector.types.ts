import { MessageResponse } from "@/types/Message";
import { MenuPosition } from "@/utils/constants/globals";
import { Dispatch, SetStateAction } from "react";

export interface MessageReactionSelectorProps {
  showReactionPicker: boolean;
  setShowReactionPicker: Dispatch<SetStateAction<boolean>>;
  reactionSelectorPosition?: {
    x: number;
    y: number;
  };
  position?: MenuPosition;
  message: MessageResponse;
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
}
