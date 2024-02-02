export interface MessageResponse {
  id: number;
  content: string;
  timestamp: number;
  edited: boolean;
  readStatus: boolean;
  senderId: number;
  receiverId?: number;
}
export type MessagesResponse = { data: MessageResponse[] };
