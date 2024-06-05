import Image from "next/image";
import { FC, memo, useEffect, useState } from "react";
import { ImagePickerProps } from "./ImagePicker.types";

const ImagePicker: FC<ImagePickerProps> = (props) => {
  const { additionalClasses, file } = props;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = () => {
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

  useEffect(() => {
    handleImageChange();
  }, [file]);

  return previewUrl ? (
    <div
      className={`${additionalClasses} overflow-hidden relative shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900 hover:border-gold-600`}
    >
      <Image
        src={previewUrl}
        alt="User profile image"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        fill
      />
    </div>
  ) : null;
};
export default memo(ImagePicker);
