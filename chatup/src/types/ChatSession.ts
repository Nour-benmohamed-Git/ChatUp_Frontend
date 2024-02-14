import { MessageResponse } from "./Message";

export interface ChatSessionResponse {
  id: number;
  participantsData: { [userId: string]: string };
  creationDate: number;
  lastActiveDate: number;
  image?: string;
  lastMessage?: MessageResponse;
  deletedByCurrentUser?: boolean;
  count?: number;
}
export type ChatSessionsResponse = { data: ChatSessionResponse[] };
