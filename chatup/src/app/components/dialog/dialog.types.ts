export interface DialogAction {
  label:
    | "confirm"
    | "remove"
    | "update"
    | "block"
    | "forward"
    | "next"
    | "previous";
  onClick: () => void;
  category: "dismissal" | "confirmation";
  disabled?: boolean;
}

export interface DialogProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: DialogAction[];
  showCancelButton?: boolean;
}
