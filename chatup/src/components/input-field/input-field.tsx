import { FC, memo } from "react";
import { Controller } from "react-hook-form";
import { InputFieldProps } from "./input-field.types";

const InputField: FC<InputFieldProps> = ({
  id,
  name,
  type,
  placeholder,
  autoComplete,
  icon,
}) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col min-h-16 w-full relative">
          {icon && (
            <div className="absolute h-10 flex items-center rounded-md text-gold-900 pl-2">
              {icon}
            </div>
          )}
          <input
            {...field}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`focus:outline-none border-2 text-sm rounded-md w-full ${
              icon ? "pl-8 pr-2 py-2" : "p-2"
            } ${fieldState?.error?.message && "border-red-500"} focus:${
              fieldState?.error?.message
                ? "border-2 border-red-300"
                : "border-2 border-gold-600"
            }`}
          />
          <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
        </div>
      )}
    />
  );
};

export default memo(InputField);
