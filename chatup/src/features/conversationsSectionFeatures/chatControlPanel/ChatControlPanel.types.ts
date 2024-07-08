import { RefObject } from "react"

export interface ChatControlPanelProps {
  conversationRelatedData: {
    [key: string]: number | boolean | string | undefined;
  };
  messageListRef?: RefObject<HTMLDivElement>;
}
