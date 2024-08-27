import { getFilesByConversationId } from "@/app/_actions/conversationActions/getFilesByConversationId";
import ActionButton from "@/app/components/actionButton/ActionButton";
import Avatar from "@/app/components/avatar/Avatar";
import DangerZone from "@/app/components/dangerZone/DangerZone";
import FileIcon from "@/app/components/fileIcon/FileIcon";
import FileViewer from "@/app/components/fileViewer/FileViewer";
import { contactInfoDangerActions } from "@/utils/constants/actionLists/contactInfoDangerActions";
import { ChatSessionType } from "@/utils/constants/globals";
import { motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import { FaPhoneAlt, FaUsers, FaVideo } from "react-icons/fa";
import {
  MdMessage,
  MdOutlineKeyboardArrowRight,
  MdPersonAddAlt1,
} from "react-icons/md";
import { ContactInfoProps } from "./ContactInfo.types";
import ContactInfoGroupSection from "@/app/components/contactInfoGroupSection/ContactInfoGroupSection";

const ContactInfo: React.FC<ContactInfoProps> = ({
  combinedData,
  onMessage,
  onAudioCall,
  onVideoCall,
}) => {
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);
  const fileListRef = useRef<HTMLUListElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const contactInfoActions = [
    { onClick: onMessage, icon: MdMessage, label: "Message" },
    { onClick: onAudioCall, icon: FaPhoneAlt, label: "Audio" },
    { onClick: onVideoCall, icon: FaVideo, label: "Video" },
    ...(combinedData.type === ChatSessionType.GROUP
      ? [
          {
            onClick: () => console.log("Add"),
            icon: MdPersonAddAlt1,
            label: "Add",
          },
        ]
      : []),
  ];

  useEffect(() => {
    const fetchFiles = async () => {
      const filesData = await getFilesByConversationId(
        combinedData?.conversationId as number
      );
      const imagesAndVideos = filesData.data?.data
        ?.filter(
          (file: any) =>
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/")
        )
        .slice(0, 12);
      setFiles(imagesAndVideos || []);
    };

    fetchFiles();
  }, [combinedData.conversationId]);

  const onSelectItem = (index: number) => {
    setSelectedFileIndex(index);
    setShowFileViewer(true);
  };
  const displayUploadedFiles = () => (
    <ul
      ref={fileListRef}
      className="flex space-x-4 overflow-auto px-4 md:px-8 py-5 w-full"
    >
      {files.map((file: any, index: number) => (
        <li
          key={index}
          className={`cursor-pointer transition-transform duration-300 shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900 rounded-md hover:border-gold-600 ${
            selectedFileIndex === index ? "scale-90" : "100"
          }`}
          onClick={() => onSelectItem(index)}
        >
          <FileIcon file={file} additionalClasses="h-24 w-24" />
        </li>
      ))}
      <li className="flex items-center justify-center text-gold-900 hover:text-gold-600 cursor-pointer">
        <div className="flex items-center justify-center h-24 w-24">
          <MdOutlineKeyboardArrowRight className="h-6 w-6" />
        </div>
      </li>
    </ul>
  );

  const onCloseFileViewer = () => {
    setSelectedFileIndex(-1);
    setShowFileViewer(false);
  };
  return (
    <>
      {showFileViewer ? (
        <motion.div
          initial="closed"
          animate={showFileViewer ? "open" : "closed"}
          variants={{ open: { y: 0 }, closed: { y: "100%" } }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={
            "z-50 fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4"
          }
        >
          <FileViewer
            files={files}
            onClose={onCloseFileViewer}
            initialSelectedFileIndex={selectedFileIndex}
          />
        </motion.div>
      ) : null}
      <div className="flex flex-col items-center w-full h-full gap-2 overflow-y-auto">
        <div className="flex flex-1 flex-col items-center gap-2 px-4 md:px-8 py-4 w-full bg-gradient-to-r from-slate-600 to-gray-700 shadow-2xl border-b border-slate-500">
          {typeof combinedData.image === "string" ? (
            <Avatar
              additionalClasses="h-36 w-36"
              rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
              fileName={combinedData.image}
            />
          ) : Array.isArray(combinedData.image) &&
            combinedData.image.length === 1 ? (
            <div className="relative">
              {[combinedData.image[0], ""].map((image, index) => (
                <Avatar
                  key={index}
                  additionalClasses={`h-16 w-16 absolute ${
                    index === 0 ? "top-3 left-6" : "-top-6 right-3"
                  }`}
                  rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
                  fileName={image}
                />
              ))}
            </div>
          ) : (
            combinedData?.image
              ?.slice(0, 2)
              .map((image, index) => (
                <Avatar
                  key={index}
                  additionalClasses={`h-16 w-16 absolute ${
                    index === 0 ? "top-3 left-6" : "-top-6 right-3"
                  }`}
                  rounded="rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
                  fileName={image}
                />
              ))
          )}

          <h2 className="text-xl font-semibold text-gray-100">
            {combinedData?.title}
          </h2>
          <p className="text-slate-300 mb-2">{combinedData?.subTitle}</p>
          <div className="flex w-full gap-2 md:gap-4">
            {contactInfoActions.map((action, index) => (
              <ActionButton
                key={index}
                onClick={action.onClick}
                icon={action.icon}
                label={action.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center w-full px-4 py-5 md:px-8 md:py-9 bg-gradient-to-r from-slate-600 to-gray-700 shadow-2xl border-b border-slate-500">
          <p className="text-xs md:text-base text-gray-100">
            {combinedData?.description}
          </p>
        </div>
        <div className="flex flex-col w-full bg-gradient-to-r from-slate-600 to-gray-700 shadow-2xl border-b border-slate-500">
          <h6
            className={`flex items-center justify-start text-xs md:text-base text-gold-600 px-4 md:px-8 py-2 w-full ${
              files.length ? "auto" : "h-24"
            }`}
          >
            Media, links & docs
          </h6>
          {files.length ? displayUploadedFiles() : null}
        </div>
        <ContactInfoGroupSection combinedData={combinedData} />
        <div className="flex flex-col w-full bg-gradient-to-r from-slate-600 to-gray-700 shadow-2xl border-b border-slate-500">
          <DangerZone
            title={combinedData?.title}
            contactInfoDangerActions={
              contactInfoDangerActions[combinedData.type]
            }
          />
        </div>
      </div>
    </>
  );
};

export default memo(ContactInfo);
