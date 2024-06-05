import { FC, memo } from "react";
import { FileViewerHeaderInfoProps } from "./FileViewerHeaderInfo.types";
const FileViewerHeaderInfo: FC<FileViewerHeaderInfoProps> = (props) => {
  const { username, timestamp } = props;
  return (
    <div className="flex flex-col">
      <div className="text-sm text-gold-600 w-32 min-h-5 md:w-44 truncate">
        {username}
      </div>
      <div className="text-sm text-slate-200"> {timestamp}</div>
    </div>
  );
};
export default memo(FileViewerHeaderInfo);
