import { FC, memo } from "react";
import { ActionButtonProps } from "./ActionButton.types";

const ActionButton: FC<ActionButtonProps> = ({
  onClick,
  icon: Icon,
  label,
}) => (
  <button
    onClick={onClick}
    className="flex flex-1 text-xs md:text-sm items-center flex-col gap-2 text-slate-200 px-4 md:px-6 py-2 rounded-md border border-gold-600 hover:bg-gradient-to-r from-slate-500 to-slate-600"
  >
    <Icon className="text-gold-900 h-6 w-6" />
    {label}
  </button>
);

export default memo(ActionButton);
