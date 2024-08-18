export interface DialogAction {
  label: "confirm" | "remove" | "update" | "block" | "forward";
  onClick: () => void;
  category: "dismissal" | "confirmation";
}

export interface DialogProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions: DialogAction[];
}
