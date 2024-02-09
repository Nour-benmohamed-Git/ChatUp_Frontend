import { IoIosCopy, IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";

export const MessageActions = [
  {
    label: "edit",
    name: "Edit",
    icon: <MdEdit size={24} />,
  },
  {
    label: "copy",
    name: "Copy",
    icon: <IoIosCopy size={24} />,
  },
  {
    label: "remove",
    name: "Remove",
    icon: <IoMdTrash size={24} />,
  },
];
