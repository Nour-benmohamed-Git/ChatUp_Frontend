import { BiBlock } from "react-icons/bi";
import { IoMdCloseCircle, IoMdTrash } from "react-icons/io";
import { MdCall, MdSearch } from "react-icons/md";

export const conversationActions = [
  {
    name: "call",
    icon: <MdCall size={24} />,
  },
  {
    label: "searchMessages",
    name: "search",
    icon: <MdSearch size={24} />,
  },
];

export const conversationMenuActions = [
  {
    label: "closeConversation",
    name: "Close conversation",
    icon: <IoMdCloseCircle size={22} />,
  },
  {
    label: "removeConversation",
    name: "Remove conversation",
    icon: <IoMdTrash size={22} />,
  },
  {
    label: "block",
    name: "Block",
    icon: <BiBlock size={22} />,
  },
];
