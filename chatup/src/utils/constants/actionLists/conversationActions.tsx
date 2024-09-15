import { IoMdCloseCircle, IoMdTrash } from "react-icons/io";
import { MdAppBlocking, MdCall, MdSearch } from "react-icons/md";

export const conversationActions = [
  // {
  //   label: "call",
  //   name: "Call",
  //   icon: <MdCall size={24} />,
  // },
  {
    label: "searchMessages",
    name: "Search",
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
    icon: <MdAppBlocking size={22} />,
  },
];
