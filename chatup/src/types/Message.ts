import { MessageType } from "@/utils/constants/globals";

export interface Message {
  id: number;
  type?: MessageType;
  content?: string;
  files?: File[];
  senderId?: number;
  timestamp: number;
  edited?: boolean;
  readBy?: {
    id: number;
    username: string;
    profilePicture: string;
  }[];
  chatSessionId?: number;
  reactions: Record<number, string>;
}

export type Messages = {
  data: Message[];
  total: number;
  newCursor: { earliest?: number; latest?: number };
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
  searchMatches: number[];
};
