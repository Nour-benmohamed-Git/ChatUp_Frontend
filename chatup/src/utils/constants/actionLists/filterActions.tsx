import { FaInbox, FaUsers } from "react-icons/fa";
import { IoMdMailUnread } from "react-icons/io";
import { ConversationFilter } from "../globals";
export const filters = [
  { label: "all", name: ConversationFilter.ALL, icon: <FaInbox /> },
  {
    label: "unread",
    name: ConversationFilter.UNREAD,
    icon: <IoMdMailUnread />,
  },
  { label: "group", name: ConversationFilter.GROUP, icon: <FaUsers /> },
];
