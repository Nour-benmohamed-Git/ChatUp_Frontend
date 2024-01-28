export interface MessageResponse {
  id: number;
  content: string;
  timestamp: number;
  edited: 1 | 2;
  readStatus: 1 | 2;
  senderId: number;
  receiverId: number;
}
export type MessagesResponse = { data: MessageResponse[] };
