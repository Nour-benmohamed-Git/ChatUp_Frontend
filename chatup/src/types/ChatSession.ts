import { Message } from "./Message";

export interface ConversationResponse {
  id: number;
  participantsData: { [userId: string]: string };
  creationDate?: number;
  lastActiveDate?: number;
  image?: string;
  lastMessage?: Message;
  deletedByCurrentUser?: boolean;
  senderId?: number;
  count?: number;
}
export type ConversationsResponse = { data: ConversationResponse[] };
