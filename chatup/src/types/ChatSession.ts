import { MessageResponse } from "./Message";

export interface ChatSessionResponse {
  id: number;
  participantsData: { [userId: string]: string };
  creationDate: number;
  lastActiveDate: number;
  title: string;
  lastMessage?: MessageResponse;
}
export type ChatSessionsResponse = { data: ChatSessionResponse[] };
