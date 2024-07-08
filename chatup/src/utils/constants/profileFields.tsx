import { FaMobileAlt } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineDescription } from "react-icons/md";
import { ProfileField } from "../schemas/updateProfileSchema";

export const profileFields: ProfileField[] = [
  {
    name: "username",
    icon: <FaRegAddressCard size={18} />,
    type: "text",
    autoComplete: "name",
  },
  {
    name: "email",
    icon: <HiOutlineMail size={18} />,
    type: "email",
    autoComplete: "email",
  },
  {
    name: "phone",
    icon: <FaMobileAlt size={18} />,
    type: "text",
    autoComplete: "phone",
  },
  {
    name: "profileInfo",
    icon: <MdOutlineDescription size={18} />,
    type: "text",
    autoComplete: "profileInfo",
  },
];
