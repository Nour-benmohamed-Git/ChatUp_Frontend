import { UserResponse } from "@/types/User";
import { IconType } from "react-icons";

export interface NavigationBarProps {
  currentUser: UserResponse;
  routesWithBadge: {
    label: string;
    count: number;
    onClick?: () => Promise<void>;
    href: string;
    icon: IconType;
    active?: boolean;
  }[];
  routes: {
    label: string;
    onClick?: () => Promise<void>;
    href: string;
    icon: IconType;
    active?: boolean;
  }[];
}
