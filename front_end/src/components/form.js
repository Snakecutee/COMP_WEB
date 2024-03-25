import PropsType from 'prop-types'

const Form = ({children, title, ...rest}) => {
  return (
    <div className="bg-white rounded-2xl border shadow-xl p-10 w-full bg-opacity-25 backdrop-blur-md">
      <form className="flex flex-col items-center space-y-4" {...rest}>
        <h1 className="font-bold text-2xl text-gray-700 w-5/6 text-center">
          {title}
        </h1>
        {children}
      </form>
    </div>
  );
};

Form.propsType = {
    children: PropsType.element,
    title: PropsType.string
}

export default Form;
