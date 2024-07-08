import { FC } from "react";

const Skeleton: FC = () => {
  return (
    <div className="flex items-center rounded-md bg-gray-900 gap-4 m-2 px-2 py-3 h-20">
      <div className="animate-pulse flex items-center space-x-4 w-full">
        <div className="rounded-full bg-slate-200 h-12 w-12"></div>
        <div className="flex-1">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-2 bg-slate-200 rounded col-span-3"></div>
              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div> 
  );
};
export default Skeleton;
