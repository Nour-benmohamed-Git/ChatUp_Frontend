import { Message } from "@/types/Message";

export interface MessageWrapperProps {
  conversationRelatedData: { [key: string]:  string | number | boolean | undefined};
  initialMessages: Message[];
}
