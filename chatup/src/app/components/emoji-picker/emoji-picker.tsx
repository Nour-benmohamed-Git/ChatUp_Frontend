import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FC, memo } from "react";
import { useFormContext } from "react-hook-form";
import { EmojiPickerProps } from "./emoji-picker.types";
const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  const { closeEmojiPicker } = props;
  const { watch, setValue } = useFormContext();

  return (
    <Picker
      data={data}
      onEmojiSelect={(data: any) => {
        setValue("message", watch("message") + data.native);
      }}
      onClickOutside={() => closeEmojiPicker()}
    />
  );
};
export default memo(EmojiPicker);
