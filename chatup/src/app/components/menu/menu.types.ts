import { MenuPosition } from "@/utils/constants/globals";
import { IconType } from "react-icons";

export interface MenuProps {
  actionList: {
    label: string;
    name: string;
    icon: JSX.Element;
    onClick: () => void;
  }[];
  position?: MenuPosition;
  icon: IconType;
}
