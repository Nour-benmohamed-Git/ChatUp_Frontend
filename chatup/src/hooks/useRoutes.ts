import { logout } from "@/app/_actions/authActions/logout";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";

import useConversation from "./useConversation";
export const labelsWithBadge = ["chat", "friends"];
const useRoutes = () => {
  const pathname = usePathname();
  const { isOpen } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "chat",
        href: "/conversations",
        icon: IoChatboxEllipses,
        active: pathname === "/conversations" || isOpen,
      },
      {
        label: "friends",
        href: "/friends",
        icon: FaUsers,
        active: pathname === "/friends",
      },
      {
        label: "addFriend",
        href: "/add-friend",
        icon: BsPersonFillAdd,
        active: pathname === "/add-friend",
      },
      {
        label: "logout",
        onClick: logout,
        href: "#",
        icon: TbLogout2,
      },
    ],
    [pathname, isOpen]
  );

  return routes;
};

export default useRoutes;
