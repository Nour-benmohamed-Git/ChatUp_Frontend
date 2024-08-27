import { FC, memo } from "react";
import { FaTrashAlt, FaUserSlash } from "react-icons/fa";
import DangerButton from "../dangerButton/DangerButton";
import { DangerZoneProps } from "./DangerZone.types";

const DangerZone: FC<DangerZoneProps> = ({
  title,
  contactInfoDangerActions,
}) => {
  return (
    <div className="flex flex-col w-full bg-gradient-to-r from-slate-600 to-gray-700 shadow-2xl border-b border-slate-500">
      {contactInfoDangerActions.map((action, index) => (
        <DangerButton
          key={index}
          label={`${action.label} ${title}`}
          icon={action.icon}
        />
      ))}
    </div>
  );
};

export default memo(DangerZone);
