import { ChatItem } from "@/types/ChatItem";
import { Socket } from "socket.io-client";

export interface BlocContainerProps {
  children: React.ReactNode;
  actions: {
    label?: string;
    name: string;
    icon: JSX.Element;
  }[];
  height: string;
  hasSearchField?: boolean;
  hasChatControlPanel?: boolean;
  paddingClass?: string;
  toggleHandlers: {
    [key: string]: { togglePanel: (event?: React.MouseEvent) => void };
  };
  selectedChatItem?: ChatItem;
  handleSelectChatItem?: (data: ChatItem) => void
  label: "chat_list_sidebar" | "chat_conversation";
  socket?: Socket;
}
