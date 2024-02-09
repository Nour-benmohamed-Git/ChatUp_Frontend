export enum PopoverPosition {
  BOTTOM_RIGHT = "bottom-right",
  BOTTOM_LEFT = "bottom-left",
  TOP_RIGHT = "top-right",
  TOP_LEFT = "top-left",
}
export interface PopoverProps {
  actionList: {
    label: string;
    name: string;
    icon: JSX.Element;
    onClick: () => void;
  }[];
  position: PopoverPosition;
}
