import { ChatSessionType } from "@/utils/constants/globals";
import { Message } from "./Message";

export interface ConversationResponse {
  id: number;
  type: ChatSessionType;
  title?: string;
  image?: string | string[];
  participantsData: { [userId: string]: { [userId: string]: string } },
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
  groupAdmins: { [userId: string]: string };
}
export type ConversationsResponse = {
  data: ConversationResponse[];
  total: number;
  unseenCount: number;
};
