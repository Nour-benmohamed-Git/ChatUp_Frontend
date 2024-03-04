import { Message } from "@/types/Message";

export interface MessageProps {
  message: Message;
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
}
