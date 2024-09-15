import { FC } from "react";
import { FiDatabase } from "react-icons/fi";

const NoData: FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <FiDatabase size={50} className="text-gold-600" />

    <p className="text-sm  text-gold-600">Empty</p>
  </div>
);

export default NoData;
