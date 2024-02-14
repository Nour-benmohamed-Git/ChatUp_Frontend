import { RefObject } from "react";

export enum MenuPosition {
  BOTTOM_RIGHT = "bottom-right",
  BOTTOM_LEFT = "bottom-left",
  TOP_RIGHT = "top-right",
  TOP_LEFT = "top-left",
}
export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  actionList: {
    label: string;
    name: string;
    icon: JSX.Element;
    onClick: () => void;
  }[];
  buttonRef: RefObject<HTMLDivElement>;
  position?: MenuPosition;
}
