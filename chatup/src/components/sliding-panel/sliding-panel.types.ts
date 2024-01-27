export interface SlidingPanelProps {
  isOpen: boolean;
  togglePanel: (event?: React.MouseEvent) => void;
  panelRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  fromSide: "right" | "left";
  title: string;
}
