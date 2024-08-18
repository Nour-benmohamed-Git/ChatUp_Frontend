import { MenuPosition } from "@/utils/constants/globals";

export interface ReactionListProps {
  position?: MenuPosition;
  reactions: Record<number, string>;
}
