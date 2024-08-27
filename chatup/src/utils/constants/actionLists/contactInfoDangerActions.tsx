import { FaTrashAlt, FaUserSlash } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";

export const contactInfoDangerActions = {
  INDIVIDUAL: [
    { label: "Delete", icon: FaTrashAlt },
    { label: "Block", icon: FaUserSlash },
  ],
  GROUP: [{ label: "Exit", icon: IoExitOutline }],
};
