import useConversation from "@/hooks/useConversation";
import { labelsWithBadge } from "@/hooks/useRoutes";
import { motion } from "framer-motion";
import { FC, memo } from "react";
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
    <div className="h-16 fixed flex items-center justify-between w-full bottom-0 z-20 bg-gray-900 border-t-[1px] md:hidden">
      {routesWithBadge.map((route) => (
        <div key={route.href} className="flex-grow h-full">
          <MobileItem
            href={route.href}
            icon={route.icon}
            active={route.active}
            count={route.count}
            onClick={route.onClick}
          />
        </div>
      ))}
      <motion.div
        className="flex justify-center relative"
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <MobileProfileItem
          profilePicture={currentUser?.profilePicture}
          currentUser={currentUser}
        />
      </motion.div>
      {routes
        .filter((item) => !labelsWithBadge.includes(item.label))
        .map((route) => (
          <div key={route.href} className="flex-grow h-full">
            <MobileItem
              href={route.href}
              icon={route.icon}
              active={route.active}
              onClick={route.onClick}
            />
          </div>
        ))}
    </div>
  );
};

export default memo(MobileNavigationBar);
