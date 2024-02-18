import { MdGroupAdd, MdPersonAddAlt1 } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";

export const sideBarActions = [
  {
    label: "newGroup",
    name: "add group",
    icon: <MdGroupAdd size={24} />,
  },
  {
    label: "newChat",
    name: "add contact",
    icon: <MdPersonAddAlt1 size={24} />,
  },
];
export const sideBarMenuActions = [
  {
    label: "logout",
    name: "Logout",
    icon: <TbLogout2 size={22} />,
  },
];
