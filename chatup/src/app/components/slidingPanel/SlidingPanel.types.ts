export interface SlidingPanelProps {
  isOpen: boolean;
  togglePanel: (event?: React.MouseEvent) => void;
  panelRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  fromSide: "right" | "left" | "top" | "bottom";
  title?: string;
  panelHeight?: string;
  panelWidth?: string;
  hasHeader?: boolean;
  zIndex?: string;
}
