import { FC, memo } from "react";
import { BadgeProps } from "./Badge.types";

const Badge: FC<BadgeProps> = (props) => {
  const { content, children } = props;

  return (
    <div className="relative inline-flex">
      {children}
      {content ? (
        <span className="z-30 absolute top-0 right-1 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white text-xs font-medium leading-none flex items-center justify-center w-6 h-6">
          {content}
        </span>
      ) : null}
    </div>
  );
};
export default memo(Badge);
