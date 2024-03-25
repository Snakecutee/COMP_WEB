import { forwardRef, useState } from 'react';
import {EyeIcon, EyeOffIcon} from '@heroicons/react/solid'

const Password = forwardRef(({ placeholder, ...rest }, ref) => {
  const [show, setShow] = useState(false);

  const toggle = (e) => {
    setShow((prev) => !prev);
  };
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 right-2 flex items-center pl-2">
        <label
          role="button"
          className="p-1 focus:outline-none focus:shadow-outline text-gray-600"
          onClick={toggle}
        >
          {show ? (
            <EyeOffIcon width={20} height={20} />
          ) : (
            <EyeIcon width={20} height={20} />
          )}
        </label>
      </span>
      <input
        type={show ? "text" : "password"}
        ref={ref}
        placeholder={placeholder}
        className="border-1 rounded-lg w-full h-12 px-4"
        {...rest}
      />
    </div>
  );
});

export default Password;