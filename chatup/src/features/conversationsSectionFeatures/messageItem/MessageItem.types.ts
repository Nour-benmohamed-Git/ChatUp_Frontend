import { Message } from "@/types/Message";

export interface MessageItemProps {
  message: Message;
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
  highlight: string;
  isHighlighted: boolean;
}
