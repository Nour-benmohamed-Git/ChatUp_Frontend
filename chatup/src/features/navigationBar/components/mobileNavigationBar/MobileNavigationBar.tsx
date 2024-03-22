import Badge from "@/app/components/badge/Badge";
import useConversation from "@/hooks/useConversation";
import { labelsWithBadge } from "@/hooks/useRoutes";
import { FC } from "react";
import { NavigationBarProps } from "../desktopNavigationBar/NavigationBar.types";
import MobileItem from "../mobileItem/MobileItem";
import MobileProfileItem from "../mobileProfileItem/MobileProfileItem";

const MobileNavigationBar: FC<NavigationBarProps> = (props) => {
  const { currentUser, routesWithBadge, routes } = props;

  const { isOpen } = useConversation();
  if (isOpen) {
    return null;
  }
  return (
    <div
      className="
        fixed 
        flex 
        items-center 
        justify-between 
        w-full 
        bottom-0 
        z-40 
        bg-gray-900
        border-t-[1px] 
        md:hidden
      "
    >
      {routesWithBadge.map((route) => (
        <div key={route.href} className="flex-grow">
          <Badge content={route.count}>
            <MobileItem
              href={route.href}
              active={route.active}
              icon={route.icon}
              onClick={route.onClick}
            />
          </Badge>
        </div>
      ))}
      <div className="flex justify-center relative">
        <MobileProfileItem profilePicture={currentUser?.profilePicture} />
      </div>
      {routes
        .filter((item) => !labelsWithBadge.includes(item.label))
        .map((route) => (
          <div key={route.href} className="flex-grow">
            <MobileItem
              href={route.href}
              active={route.active}
              icon={route.icon}
              onClick={route.onClick}
            />
          </div>
        ))}
    </div>
  );
};

export default MobileNavigationBar;
