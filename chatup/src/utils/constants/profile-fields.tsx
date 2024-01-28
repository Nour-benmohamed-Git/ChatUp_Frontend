import { FaMobileAlt } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import { MdOutlineDescription } from "react-icons/md";

export const profileFields  = [
  {
    name: "username",
    icon: <FaRegAddressCard size={18} />,
  },
  {
    name: "email",
    icon: <IoMailOutline size={18} />,
  },
  {
    name: "phone",
    icon: <FaMobileAlt size={18} />,
  },
  {
    name: "profileInfo",
    icon: <MdOutlineDescription size={18} />,
  },
];
