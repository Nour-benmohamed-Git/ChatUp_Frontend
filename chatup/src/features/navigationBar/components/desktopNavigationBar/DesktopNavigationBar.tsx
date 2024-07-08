import Avatar from "@/app/components/avatar/Avatar";
import Badge from "@/app/components/badge/Badge";
import { labelsWithBadge } from "@/hooks/useRoutes";
import Link from "next/link";
import { FC, memo, useEffect, useRef, useState } from "react";
import DesktopItem from "../desktopItem/DesktopItem";
import { NavigationBarProps } from "./NavigationBar.types";
import { usePathname } from "next/navigation";

const DesktopNavigationBar: FC<NavigationBarProps> = (props) => {
  const { currentUser, routesWithBadge, routes } = props;
  const navRef = useRef<HTMLUListElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const pathname = usePathname();
  const handleItemClick = (e: React.MouseEvent) => {
    if (navRef.current) {
      const itemElement = e.currentTarget as HTMLElement;
      const itemRect = itemElement.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();

      setIndicatorStyle({
        top: `${itemRect.top - navRect.top}px`,
        height: `${itemRect.height}px`,
      });
    }
  };

  useEffect(() => {
    if (navRef.current) {
      const firstSegment = `/${pathname.split("/")[1]}`;
      const activeItem = navRef.current.querySelector(
        `a[href="${firstSegment}"]`
      );
      if (activeItem) {
        const itemRect = activeItem.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();

        setIndicatorStyle({
          top: `${itemRect.top - navRect.top}px`,
          height: `${itemRect.height}px`,
        });
      } else {
        setIndicatorStyle({});
      }
    }
  }, [pathname]);
  return (
    <div className="hidden md:flex md:flex-col md:justify-between md:col-span-1 bg-gray-900 md:border-r md:border-slate-500 h-full">
      <nav className="h-full items-center my-2.5 flex flex-col justify-between">
        <ul
          ref={navRef}
          role="list"
          className="flex flex-col items-center relative gap-5"
        >
          <div
            className="absolute left-0 top-0 w-full bg-gray-800 rounded-md transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
          {routesWithBadge.map((item) => (
            <Badge key={item.label} content={item.count}>
              <DesktopItem
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={(e) => handleItemClick(e)}
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
                onClick={(e) => {
                  item.onClick ? item.onClick() : handleItemClick(e);
                }}
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
