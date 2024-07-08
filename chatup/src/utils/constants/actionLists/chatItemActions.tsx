import { FaSquarePen } from "react-icons/fa6";
import { IoMdTrash } from "react-icons/io";

export const chatItemActions = [
  {
    label: "rename",
    name: "Rename",
    icon: <FaSquarePen size={22} />,
  },
  {
    label: "remove",
    name: "Remove",
    icon: <IoMdTrash size={22} />,
  },
];
