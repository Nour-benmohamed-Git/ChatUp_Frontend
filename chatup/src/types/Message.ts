export interface Message {
  id?: number;
  content?: string;
  files?: File[];
  senderId?: number;
  receiverId?: number;
  timestamp?: number;
  edited?: boolean;
  readStatus?: boolean;
  chatSessionId?: number;
  groupId?: number;
}

export type Messages = { data: Message[] };
