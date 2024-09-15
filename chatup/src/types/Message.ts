import { FileType, MessageType } from "@/utils/constants/globals";

export type MessageFile = {
  filename?: string;
  fileType: FileType;
};
export interface MessageResponse {
  id: number;
  type?: MessageType;
  content?: string;
  files?: MessageFile[];
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

export interface MessageRequest {
  id: number;
  type?: MessageType;
  content?: string;
  files?: File[];
  senderId?: number;
  chatSessionId?: number;
  reactions: Record<number, string>;
}
export type MessagesResponse = {
  data: MessageResponse[];
  total: number;
  newCursor: { earliest?: number; latest?: number };
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
  searchMatches: number[];
};
