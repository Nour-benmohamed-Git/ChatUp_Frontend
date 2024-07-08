import { MenuPosition } from "@/utils/constants/globals";
import { RefObject } from "react";


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
