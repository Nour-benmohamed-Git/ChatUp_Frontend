import { MessageFile } from "@/types/Message";

type Message = {
  content?: string;
  files?: MessageFile[];
};

export type LastMessagePreviewProps = {
  lastMessage?: Message;
};
