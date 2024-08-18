import Picker from "@emoji-mart/react";
import { FC, memo, useEffect, useState } from "react";
import { EmojiPickerProps } from "./EmojiPicker.types";
import Loader from "../loader/Loader";
import { toast } from "sonner";
interface EmojiData {
  native: string;
}
const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  const { closeEmojiPicker, handleEmojiSelect, name } = props;
  const [emojiData, setEmojiData] = useState<EmojiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmojiData = async () => {
      try {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch emoji data");
        }
        const jsonData = await response.json();
        setEmojiData(jsonData);
      } catch (err: unknown) {
        toast.error("Error loading emoji data");
        console.error("Error loading emoji data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmojiData();
  }, []);
  if (loading)
    return (
      <div className="flex items-center justify-center bg-white h-[27rem] w-[22rem] rounded-md">
        <Loader />
      </div>
    );
  return (
    <div className="h-[27rem] w-[22rem]">
      <Picker
        data={emojiData}
        onEmojiSelect={(data: any) =>
          handleEmojiSelect({ name: name, emoji: data.native })
        }
        onClickOutside={closeEmojiPicker}
      />
    </div>
  );
};
export default memo(EmojiPicker);
