import { memo } from "react";
import { Controller } from "react-hook-form";
import { InputFieldProps } from "./input-field.types";

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  placeholder,
  autoComplete,
}) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col min-h-16 w-full">
          <input
            {...field}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`focus:outline-none border-2 text-sm rounded-md w-full p-2 ${
              fieldState?.error?.message && "border-red-500"
            } focus:${
              fieldState?.error?.message
                ? "border-2 border-red-300"
                : "border-2 border-gold-600"
            }`}
          />
          <p className="text-red-500 text-xs"> {fieldState?.error?.message}</p>
        </div>
      )}
    />
  );
};

export default memo(InputField);
