import { Message } from "@/types/Message";
import { UserResponse } from "@/types/User";

export interface SelectedConversationProps {
  conversationRelatedData: {
    [key: string]: number | boolean | string | undefined;
  };
  initialMessages: Message[];
  userData: UserResponse;
}
