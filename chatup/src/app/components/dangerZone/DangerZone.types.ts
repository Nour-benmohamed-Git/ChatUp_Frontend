import { IconType } from "react-icons";

export interface DangerZoneProps {
  title?: string;
  contactInfoDangerActions: { label: string; icon: IconType }[];
}
