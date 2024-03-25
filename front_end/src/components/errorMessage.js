import {ExclamationIcon} from '@heroicons/react/solid'

const ErrorMessageCustom = ({message}) => {
    return (
      <div
        className=" text-red-900 w-fit px-2"
        role="alert"
      >
        <span className="flex w-fit items-center gap-1"><ExclamationIcon className="w-5 h-5" />{message}</span>
      </div>
    );
}

export default ErrorMessageCustom;