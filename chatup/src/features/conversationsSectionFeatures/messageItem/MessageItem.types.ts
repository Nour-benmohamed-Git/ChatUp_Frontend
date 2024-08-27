import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import { Message } from "@/types/Message";
import { UsersResponse } from "@/types/User";

export interface MessageItemProps {
  message: Message;
  combinedData: ConversationCombinedType
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
  highlight: string;
  isHighlighted: boolean;
  initialFriends: UsersResponse;
}
