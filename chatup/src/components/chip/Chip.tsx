import { FC, memo } from "react";
import { ChipProps } from "./chip.types";

const Chip: FC<ChipProps> = (props) => {
  const { content } = props;
  return (
    <div className="flex justify-center items-center m-1 py-2 px-2 rounded-md text-gray-900 font-medium bg-gray-100 border border-gray-300 shadow-2xl">
      <div className="text-xs font-normal leading-none max-w-full flex-initial">
        {content}
      </div>
    </div>
  );
};
export default memo(Chip);
