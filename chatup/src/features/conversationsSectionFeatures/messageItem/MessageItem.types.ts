import { ConversationsResponse } from "@/types/ChatSession";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import { Message } from "@/types/Message";

export interface MessageItemProps {
  message: Message;
  combinedData: ConversationCombinedType;
  conversationRelatedData: {
    [key: string]: string | number | boolean | undefined;
  };
  highlight: string;
  isHighlighted: boolean;
  initialConversations: ConversationsResponse;
}

export interface TapCoordinates {
  x: number;
  y: number;
}

export interface State {
  openSoftRemove: boolean;
  openHardRemove: boolean;
  openForwardMessage: boolean;
  showReactionPicker: boolean;
  tapCoordinates: TapCoordinates;
}

export type Action =
| { type: 'TOGGLE_SOFT_REMOVE' }
| { type: 'TOGGLE_HARD_REMOVE' }
| { type: 'TOGGLE_FORWARD_MESSAGE' }
| { type: 'TOGGLE_REACTION_PICKER' }
| { type: 'SET_TAP_COORDINATES'; payload: TapCoordinates };