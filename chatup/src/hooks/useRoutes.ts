import { logout } from "@/app/_actions/auth-actions/logout";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { IoChatboxEllipses, IoPeople } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
export const labelsWithBadge = ["chat", "friends"];
const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        label: "chat",
        href: "/conversations",
        icon: IoChatboxEllipses,
        active: pathname === "/conversations",
      },
      {
        label: "friends",
        href: "/friends",
        icon: IoPeople,
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
        onClick: () => logout(),
        href: "#",
        icon: TbLogout2,
      },
    ],
    [pathname]
  );

  return routes;
};

export default useRoutes;
