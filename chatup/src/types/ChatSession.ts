import { Message } from "./Message";

export interface ConversationResponse {
  id: number;
  participantsData: { [userId: string]: string };
  creationDate?: number;
  lastActiveDate?: number;
  title?: string;
  image?: string;
  lastMessage?: Message;
  deletedByCurrentUser?: boolean;
  senderId?: number;
  unreadMessages?: { [userId: number]: number[] };
  seen?: boolean;

}
export type ConversationsResponse = {
  data: ConversationResponse[];
  total: number;
};
