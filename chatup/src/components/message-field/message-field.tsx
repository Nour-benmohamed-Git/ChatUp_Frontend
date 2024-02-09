import { memo } from "react";
import { Controller } from "react-hook-form";
import { MessageFieldProps } from "./message-field.types";

const MessageField: React.FC<MessageFieldProps> = ({
  id,
  name,
  placeholder,
}) => {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <div className="flex flex-col justify-center w-full">
          <textarea
            {...field}
            autoFocus
            id={id}
            name={name}
            rows={1}
            style={{ resize: "none" }}
            placeholder={placeholder}
            className={`focus:outline-none border-2 text-sm rounded-md w-full p-2  focus:${"border-2 border-gold-600"}`}
          />
        </div>
      )}
    />
  );
};

export default memo(MessageField);
