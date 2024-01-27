import { FC, memo } from "react";
import { FaRegSadCry } from "react-icons/fa";
import { NoDataFoundProps } from "./no-data-found.types";

const NoDataFound: FC<NoDataFoundProps> = (props) => {
  const { message } = props;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
      <FaRegSadCry className="text-6xl text-gold-600 mb-4" />
      <p className="text-md font-bold text-gold-600">{message}</p>
    </div>
  );
};

export default memo(NoDataFound);
