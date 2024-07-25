import { RefObject } from "react";

export interface MessageFieldProps {
  id: string;
  name: string;
  placeholder: string;
  messageFieldRef: RefObject<HTMLTextAreaElement>;
  handleSendMessage: () => Promise<void>;
}
