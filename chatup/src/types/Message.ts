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
}

export type Messages = {
  data: Message[];
  total: number;
  newCursor: { earliest?: number; latest?: number };
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
};
