import { FaSquarePen } from "react-icons/fa6";
import { IoMdTrash } from "react-icons/io";
import { MdAppBlocking } from "react-icons/md";

export const FriendItemActions = [
  {
    label: "remove",
    name: "Remove",
    icon: <IoMdTrash size={22} />,
  },
  {
    label: "block",
    name: "Block",
    icon: <MdAppBlocking size={22} />,
  },
];
