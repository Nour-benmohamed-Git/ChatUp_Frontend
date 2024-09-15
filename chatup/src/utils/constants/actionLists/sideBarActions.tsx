import { HiArchive } from "react-icons/hi";
import { MdGroupAdd } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";

export const sideBarMenuActions = {
  chat: [
    {
      label: "newGroup",
      name: "New group",
      icon: <MdGroupAdd size={22} />,
    },
    {
      label: "archived",
      name: "Archived",
      icon: <HiArchive size={22} />,
    },
    {
      label: "logout",
      name: "Logout",
      icon: <TbLogout2 size={22} />,
    },
  ],
  profile: [
    {
      label: "logout",
      name: "Logout",
      icon: <TbLogout2 size={22} />,
    },
  ],
  friends: [
    {
      label: "logout",
      name: "Logout",
      icon: <TbLogout2 size={22} />,
    },
  ],
  friendRequest: [
    {
      label: "logout",
      name: "Logout",
      icon: <TbLogout2 size={22} />,
    },
  ],
  archived: [
    {
      label: "logout",
      name: "Logout",
      icon: <TbLogout2 size={22} />,
    },
  ],
};
