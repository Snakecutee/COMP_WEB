import PropsType from "prop-types";
import { forwardRef } from "react";

const InputField = forwardRef(({type, placeholder,disabled, ...rest}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      placeholder={placeholder}
      className={`${
        disabled ? "bg-gray-300 border-none" : "bg-inherit border-1"
      }  rounded-lg w-full h-12 px-4`}
      {...rest}
      disabled={disabled || false}
    />
  );
})

InputField.propsType = {
  type: PropsType.oneOf(["text", "password", "email", "number"]),
  placeholder: PropsType.string
}

export default InputField;
