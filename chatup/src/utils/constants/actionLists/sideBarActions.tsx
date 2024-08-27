import { TbLogout2 } from "react-icons/tb";
import { MdOutlineGroupAdd } from "react-icons/md";

export const sideBarMenuActions = [
  {
    label: "newGroup",
    name: "New group",
    icon: <MdOutlineGroupAdd size={22} />,
  },
  {
    label: "logout",
    name: "Logout",
    icon: <TbLogout2 size={22} />,
  },
];
