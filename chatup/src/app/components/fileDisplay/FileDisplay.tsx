import { FC, memo, useState } from "react";
import FileIcon from "../fileIcon/FileIcon";
import { FileDisplayProps } from "./FileDisplay.types";
import { motion } from "framer-motion";
import FileViewer from "../fileViewer/FileViewer";

const FileDisplay: FC<FileDisplayProps> = (props) => {
  const { files ,messageDetails} = props;
  const [showFileViewer, setShowFileViewer] = useState(false);
  const renderFiles = () => {
    const imagesAndVideos = files.filter(
      (file: any) =>
        file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")
    );
    const otherFiles = files.filter(
      (file: any) =>
        !file.mimetype.startsWith("image/") &&
        !file.mimetype.startsWith("video/")
    );
    if (!files?.length) return null;

    return (
      <>
        {showFileViewer ? (
          <motion.div
            initial="closed"
            animate={showFileViewer ? "open" : "closed"}
            variants={{ open: { y: 0 }, closed: { y: "100%" } }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={
              "z-50 absolute bottom-0 left-0 w-full h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4"
            }
          >
            <FileViewer
              files={imagesAndVideos}
              onClose={() => setShowFileViewer(false)}
              messageDetails={messageDetails}
            />
          </motion.div>
        ) : null}
        <div className="flex flex-col gap-2">
          {imagesAndVideos.length > 0 && (
            <div
              role="button"
              className="flex flex-col gap-2 hover:opacity-85"
              onClick={() => setShowFileViewer(true)}
            >
              {imagesAndVideos.length === 1 ? (
                <div className="flex items-center justify-center">
                  <FileIcon
                    file={imagesAndVideos[0]}
                    additionalClasses="h-40 w-40 rounded-md"
                  />
                </div>
              ) : imagesAndVideos.length > 4 ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    {imagesAndVideos.slice(0, 2).map((file: any) => (
                      <FileIcon
                        key={file.id}
                        file={file}
                        additionalClasses="h-40 w-40 rounded-md"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FileIcon
                      file={imagesAndVideos[2]}
                      additionalClasses="h-40 w-40 rounded-md"
                    />
                    <div className="flex items-center justify-center h-40 w-40 rounded-md border border-gold-600 text-gold-600">
                      +{imagesAndVideos.length - 3} more
                    </div>
                  </div>
                </>
              ) : (
                imagesAndVideos.map((file: any, index: number) =>
                  index % 2 === 0 ? (
                    <div key={index} className="flex gap-2">
                      <FileIcon
                        key={file.id}
                        file={file}
                        additionalClasses="h-40 w-40 rounded-md"
                      />
                      {imagesAndVideos[index + 1] && (
                        <FileIcon
                          file={imagesAndVideos[index + 1]}
                          additionalClasses="h-40 w-40 rounded-md"
                        />
                      )}
                    </div>
                  ) : null
                )
              )}
            </div>
          )}
          {otherFiles.length > 0 && (
            <div className="flex flex-col items-start gap-2">
              {otherFiles.map((file: any) => (
                <FileIcon
                  key={file.id}
                  file={file}
                  additionalClasses="h-40 w-40 rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return renderFiles();
};

export default memo(FileDisplay);
