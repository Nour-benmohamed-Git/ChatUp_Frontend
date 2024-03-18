import { Message } from "@/types/Message";

export interface MessageListProps {
  conversationRelatedData: { [key: string]:  string | number | boolean | undefined};
  initialMessages: Message[];
}
