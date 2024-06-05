import useAutoSizeTextArea from "@/hooks/useAutoSizeTextArea";
import {
  ChangeEvent,
  DragEvent,
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";
import { IoIosClose } from "react-icons/io";
import { MdCloudUpload, MdOutlineAdd } from "react-icons/md";
import { RiCloseLine, RiSendPlaneFill } from "react-icons/ri";
import FilePicker from "../filePicker/FilePicker";
import ImagePicker from "../imagePicker/ImagePicker";
import MessageField from "../message-field/message-field";
import VideoPicker from "../videoPicker/VideoPicker";
import { FileDropAreaProps } from "./FileDropArea.types";

const FileDropArea: FC<FileDropAreaProps> = ({
  onClose,
  handleSendMessage,
}) => {
  const { watch, setValue, getValues } = useFormContext();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoSizeTextArea(textAreaRef.current, getValues("message"));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const fileListRef = useRef<HTMLUListElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files as FileList;
    setValue("files", [...getValues("files"), ...Array.from(files)]);
    // Reset file input value to allow re-uploading the same file

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFileIndex(watch("files").length - 1);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.effectAllowed = "copy"; // Indicate allowed drag action
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer!.files as FileList;
    setValue("files", Array.from(droppedFiles));
  };

  const handleUpload = () => {
    handleSendMessage();
    setValue("files", []);
    onClose();
  };
  const handleRemoveFile = (indexToRemove: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedFiles = getValues("files").filter(
      (_: any, index: number) => index !== indexToRemove
    );
    setValue("files", updatedFiles);
    setSelectedFileIndex(watch("files").length - 1);
  };

  const displayUploadedFiles = () =>
    watch("files").length > 0 && (
      <ul
        ref={fileListRef}
        className="flex space-x-4 overflow-auto p-4 max-w-[calc(100%-4rem)]"
      >
        {watch("files").map((file: any, index: number) => (
          <li
            key={index}
            className={`relative cursor-pointer ${
              selectedFileIndex === index ? "scale-90" : "100"
            }`}
            onClick={() => setSelectedFileIndex(index)}
          >
            <button
              className="absolute top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 p-1 bg-gray-900 text-white rounded-full text-xs hover:bg-gray-700 z-10"
              onClick={(event) => handleRemoveFile(index, event)}
            >
              <RiCloseLine size={10} />
            </button>
            {file.type.startsWith("image/") ? (
              <ImagePicker
                file={file}
                additionalClasses="h-14 w-14 rounded-md"
              />
            ) : file.type.startsWith("video/") ? (
              <VideoPicker
                file={file}
                additionalClasses="h-14 w-14 rounded-md"
              />
            ) : (
              <FilePicker
                file={file}
                additionalClasses="h-14 w-14 rounded-md"
              />
            )}
          </li>
        ))}
      </ul>
    );
  useEffect(() => {
    if (fileListRef.current) {
      const selectedItem = fileListRef.current.children[
        selectedFileIndex
      ] as HTMLElement;
      const containerWidth = fileListRef.current.offsetWidth;
      const itemWidth = selectedItem.offsetWidth;
      const scrollPosition =
        selectedItem.offsetLeft - containerWidth / 2 + itemWidth / 2;

      fileListRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [selectedFileIndex]);
  return (
    <div className="w-full h-full space-y-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-medium text-gold-700">Upload Documents</h1>
        <button
          className="text-2xl text-gold-900 hover:text-gold-600 rounded-full"
          onClick={onClose}
        >
          <IoIosClose className="h-8 w-8" />
        </button>
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="h-[calc(100%-2.75rem)] rounded-lg shadow-lg border border-dashed border-gray-400 hover:border-gold-700 p-4 flex flex-col items-center justify-center"
      >
        {watch("files").length === 0 ? (
          <div className="flex flex-col items-center space-y-4 max-w-full">
            <p className="text-lg text-white text-center">
              Drag & drop photos or click to select
            </p>
            <label
              htmlFor="fileInput"
              role="button"
              className="rounded-full bg-gold-900 hover:bg-gold-600 p-4 flex items-center justify-center"
            >
              <MdCloudUpload className="text-white text-2xl" />
            </label>
            <div className="text-sm text-center text-gray-400">
              Supported formats: JPG, JPEG, PNG, GIF, MP4, MOV, WEBP, AVI, WMV,
              FLV, PDF, DOCX, TXT
              <br />
              Maximum file size: 5 MB
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-between h-full w-full">
            <div className="flex items-center justify-center min-h-60 min-w-60">
              {watch("files")[selectedFileIndex].type.startsWith("image/") ? (
                <ImagePicker
                  file={watch("files")[selectedFileIndex]}
                  additionalClasses="h-48 w-40 rounded-md"
                />
              ) : watch("files")[selectedFileIndex].type.startsWith(
                  "video/"
                ) ? (
                <VideoPicker
                  file={watch("files")[selectedFileIndex]}
                  additionalClasses="h-60 w-96 rounded-md"
                  controls
                />
              ) : (
                <FilePicker
                  file={watch("files")[selectedFileIndex]}
                  additionalClasses="h-48 w-40 rounded-md"
                  showFileDetails
                />
              )}
            </div>
            <div className="flex flex-col w-full">
              <div className="pl-4 py-4 w-[calc(100%-4rem)]">
                <MessageField
                  id="message"
                  name="message"
                  placeholder="Type your message"
                  messageFieldRef={textAreaRef}
                />
              </div>
              <div className="flex items-center w-full">
                {displayUploadedFiles()}
                <label
                  htmlFor="fileInput"
                  role="button"
                  className="flex justify-center items-center h-14 w-14 text-5xl text-gold-900 hover:text-gold-600 shadow-2xl rounded-md border-2 border-dashed border-slate-700 ml-2"
                >
                  <MdOutlineAdd />
                </label>
                <button
                  onClick={handleUpload}
                  className="flex justify-center items-center h-14 w-14 text-5xl text-gold-900 hover:text-gold-600 shadow-2xl rounded-md border-2 border-slate-700 ml-2"
                >
                  <RiSendPlaneFill />
                </button>
              </div>
            </div>
          </div>
        )}
        <input
          id="fileInput"
          ref={fileInputRef}
          className="hidden"
          type="file"
          multiple
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default memo(FileDropArea);
