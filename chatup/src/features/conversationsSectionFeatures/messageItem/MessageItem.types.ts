import { Message } from "@/types/Message";
import { UsersResponse } from "@/types/User";

export interface MessageItemProps {
  message: Message;
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
  highlight: string;
  isHighlighted: boolean;
  initialFriends: UsersResponse;
}
