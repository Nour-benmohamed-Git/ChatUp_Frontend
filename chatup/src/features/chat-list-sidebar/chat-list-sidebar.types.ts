import { ChatItem } from "@/types/ChatItem";

export interface ChatListSidebarProps {
  handleSelectChatItem: (data: ChatItem) => void;
}
