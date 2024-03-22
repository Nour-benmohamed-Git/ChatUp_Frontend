import { FC, memo } from "react";
import { BadgeProps } from "./Badge.types";

const Badge: FC<BadgeProps> = (props) => {
  const { content, children } = props;

  return (
    <div className="relative inline-flex w-full">
      {children}
      {content ? (
        <span className="absolute rounded-full py-1 px-1 text-xs font-medium content-[''] leading-none grid place-items-center top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 bg-red-500 text-white min-w-[24px] min-h-[24px]">
          {content}
        </span>
      ) : null}
    </div>
  );
};
export default memo(Badge);
