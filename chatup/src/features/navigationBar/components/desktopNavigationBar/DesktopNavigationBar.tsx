import Avatar from "@/app/components/avatar/avatar";
import Badge from "@/app/components/badge/Badge";
import { labelsWithBadge } from "@/hooks/useRoutes";
import Link from "next/link";
import { FC, memo } from "react";
import DesktopItem from "../desktopItem/DesktopItem";
import { NavigationBarProps } from "./NavigationBar.types";

const DesktopNavigationBar: FC<NavigationBarProps> = (props) => {
  const { currentUser, routesWithBadge, routes } = props;

  return (
    <div className="hidden md:flex md:flex-col md:justify-between md:col-span-1 bg-gray-900 md:border-r md:border-slate-500 h-full">
      <nav className="h-full items-center my-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-2">
          {routesWithBadge.map((item) => (
            <Badge key={item.label} content={item.count}>
              <DesktopItem
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            </Badge>
          ))} 
          {routes
            .filter((item) => !labelsWithBadge.includes(item.label))
            .map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
        </ul>
        <Link href={"/profile"}>
          <Avatar
            additionalClasses="h-10 w-10 rounded-md"
            fileName={currentUser?.profilePicture}
          />
        </Link>
      </nav>
    </div>
  );
};

export default memo(DesktopNavigationBar);
