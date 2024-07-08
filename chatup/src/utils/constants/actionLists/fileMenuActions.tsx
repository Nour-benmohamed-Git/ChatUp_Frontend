import { IoCameraSharp, IoLocation } from "react-icons/io5";
import { HiDocument } from "react-icons/hi2";

export const fileMenuActions = [
  {
    label: "documents",
    name: "Documents",
    icon: <HiDocument size={22} />,
  },
  {
    label: "camera",
    name: "Camera",
    icon: <IoCameraSharp size={22} />,
  },
  {
    label: "location",
    name: "Location",
    icon: <IoLocation size={22} />,
  },
];
