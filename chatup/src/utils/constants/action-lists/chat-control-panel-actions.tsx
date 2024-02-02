import { FaPlus } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";

export const chatControlPanelActions = [
  {
    label: "emojiPicker",
    name: "Emoji picker",
    icon: <MdEmojiEmotions size={24} />,
  },
  {
    label: "addFiles",
    name: "add files",
    icon: <FaPlus size={24} />,
  },
];
