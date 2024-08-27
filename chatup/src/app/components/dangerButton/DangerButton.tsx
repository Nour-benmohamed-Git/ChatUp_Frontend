import { FC, memo } from "react";
import { DangerButtonProps } from "./DangerButton.types";

const DangerButton: FC<DangerButtonProps> = ({ label, icon: Icon }) => (
  <button className="flex items-center gap-6 text-red-500 hover:bg-gradient-to-r from-slate-500 to-slate-600 px-4 md:px-8 py-5">
    <Icon className="text-red-500 h-6 w-6" />
    {label}
  </button>
);

export default memo(DangerButton);
