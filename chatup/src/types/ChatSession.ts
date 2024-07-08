import { Message } from "./Message";

export interface ConversationResponse {
  id: number;
  type: 0 | 1;
  title?: string;
  image?: string;
  participantsData: { [userId: string]: string };
  creationDate: number;
  lastActiveDate: number;
  lastMessage?: {
    content: string;
    timestamp: number;
  };
  deletedByCurrentUser?: boolean;
  senderId?: number;
  unreadMessagesCount?: number;
  seen?: boolean;
}
export type ConversationsResponse = {
  data: ConversationResponse[];
  total: number;
  unseenCount: number;
};
