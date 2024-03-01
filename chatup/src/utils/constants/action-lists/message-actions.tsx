import { IoIosCopy, IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

export const messageActions = [
  {
    label: "edit",
    name: "Edit",
    icon: <MdEdit size={22} />,
  },
  {
    label: "copy",
    name: "Copy",
    icon: <IoIosCopy size={22} />,
  },
  {
    label: "softRemove",
    name: "Soft remove",
    icon: <IoMdTrash size={22} />,
  },
  {
    label: "hardRemove",
    name: "Hard remove",
    icon: <MdDeleteOutline size={22} />,
  },
];
