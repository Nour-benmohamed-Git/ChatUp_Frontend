import { getErrorMessage } from "@/utils/config/rtk-error-standardizer";
import { FC, memo } from "react";
import { ErrorBoxProps } from "./error-box.types";

const ErrorBox: FC<ErrorBoxProps> = (props) => {
  const {error}=props
  return (
    <div className="flex items-center justify-center h-full text-red-600">
      Error: {getErrorMessage(error)}
    </div>
  );
};
export default memo(ErrorBox);
