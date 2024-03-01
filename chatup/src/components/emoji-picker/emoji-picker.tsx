import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FC, memo } from "react";
import { useFormContext } from "react-hook-form";
import { EmojiPickerProps } from "./emoji-picker.types";
const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  const { closeEmojiPicker } = props;
  const methods = useFormContext();

  return (
    <Picker
      data={data}
      onEmojiSelect={(data: any) => {
        methods.setValue("message", methods.watch("message") + data.native);
      }}
      onClickOutside={() => closeEmojiPicker()}
    />
  );
};
export default memo(EmojiPicker);
