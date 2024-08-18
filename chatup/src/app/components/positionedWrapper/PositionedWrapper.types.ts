import { MenuPosition } from "@/utils/constants/globals";
import { RefObject } from "react";

export type PositionedWrapperProps = {
  isOpen: boolean;
  onClose: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  buttonRef: RefObject<HTMLDivElement>;
  tapCoordinates?: {
    x: number;
    y: number;
  };
  position?: MenuPosition;
  children: React.ReactNode;
  
};
