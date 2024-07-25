import { FC, memo, useEffect, useState } from "react";
import { VideoPickerProps } from "./VideoPicker.types";

const VideoPicker: FC<VideoPickerProps> = (props) => {
  const { additionalClasses, file, controls } = props;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleVideoChange = () => {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setPreviewUrl(reader.result);
          }
        }; 
        reader.readAsDataURL(file);
      }
    };
    handleVideoChange();
  }, [file]);

  return previewUrl ? (
    <video
      controls={controls}
      className={`${additionalClasses} overflow-hidden shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900 object-cover`}
    >
      <source src={previewUrl} />
    </video>
  ) : null;
};

export default memo(VideoPicker);
