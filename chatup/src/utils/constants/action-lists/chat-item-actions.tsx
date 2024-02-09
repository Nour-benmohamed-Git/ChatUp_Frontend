import { FaSquarePen } from "react-icons/fa6";
import { IoMdTrash } from "react-icons/io";

export const ChatItemActions = [
  {
    label: "rename",
    name: "Rename",
    icon: <FaSquarePen size={24} />,
  },
  {
    label: "remove",
    name: "Remove",
    icon: <IoMdTrash size={24} />,
  },
];
