import { connect } from "react-redux";

import { LockClosedIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {login} from '../store/actions/authenticateAction';
import Form from "../components/form";
import InputField from "../components/inputField";
import Password from "../components/password";
import Button from "../components/button";
import { ErrorMessage } from "@hookform/error-message";
import ErrorMessageCustom from "../components/errorMessage";
import logo from '../assets/logo.png';

const loginFormValidationSchema = yup.object({
  username: yup.string().required("Username must be filled"),
  password: yup.string().required("Password must be filled"),
});

const LoginPage = ({ submitLoginForm }) => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginFormValidationSchema),
  });


  const onSubmit = (formData) => {
    submitLoginForm(formData)
  };

  return (
    <>
      <div
        className={`relative z-10 bg-cover min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-lg w-screen space-y-8">
          <div>
            <img
              className="mx-auto h-20 w-auto animate-bounce"
              src={logo}
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
          </div>
          <div className="w-full">
            <Form>
              <InputField
                {...register("username")}
                type="text"
                placeholder="Username"
              />
              <ErrorMessage
                errors={errors}
                name="username"
                render={({ message }) => (
                  <ErrorMessageCustom message={message} />
                )}
              />
              <Password {...register("password")} placeholder="Password" />
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => (
                  <ErrorMessageCustom message={message} />
                )}
              />

              <div>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  role="submit"
                  type="primary"
                  title="Login"
                  icon={LockClosedIcon}
                ></Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitLoginForm: (formData) => dispatch(login(formData))
  }
}

export default connect(null, mapDispatchToProps)(LoginPage);
