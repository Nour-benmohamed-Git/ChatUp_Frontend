export interface Message {
  id?: number;
  content?: string;
  senderId?: number;
  receiverId?: number;
  timestamp?: number;
  edited?: boolean;
  readStatus?: boolean;
  chatSessionId?: number;
  groupId?: number;
}

export type Messages = { data: Message[] };
