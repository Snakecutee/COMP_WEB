import React, { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import {
  register as registerApi,
  getAllDepartment,
  tokenRequestInterceptor,
  uploadImage,
} from "../../apiServices/index";
import { toast } from "react-toastify";
import Form from "../../components/form";
import InputField from "../../components/inputField";
import Button from "../../components/button";
import SelectOption from "../../components/SelectOption";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "../../components/DateTimePicker";
import { ErrorMessage } from "@hookform/error-message";
import ErrorMessageCustom from "../../components/errorMessage";
import {PlusCircleIcon} from '@heroicons/react/solid'



const registerFormValidationSchema = yup.object({
  fullname: yup.string().required("Fullname must be filled"),
  username: yup
    .string()
    .email("Username be a valid email")
    .max(255)
    .required("Username is required"),
  
  dateOfBirth: yup
    .date()
    .required("Date of Birth is required")
    .min(new Date(1950, 0, 1), "Your Birthday cannot before 1/1/1950")
    .max(new Date(2004, 0, 1), "Your Birthday cannot after 1/1/2004"),
});


const RegisterPage = ({ close, loadUser, token, getNewTokenRequest, roles }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(registerFormValidationSchema),
    defaultValues: {
      username: "",
      dateOfBirth: "",
      gender: "Male",
      fullname: "",
      role: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
  });

  const [avatar, setAvatar] = useState("");

  const options = roles.ALL.map(role => ({ name: role, value: role }));

  const onEditChange = (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    const upload = async () => {
      const { status, data } = await uploadImage(formData);
      if (status === 200) {
        setValue("avatar", data.path);
       setAvatar(data.path);
      }
    };
    upload();
  }

  useEffect(() => {
    console.log(options);
  },[]);

  const onSubmit = async (formData) => {
    const { status, data } = await registerApi(formData);
    if (status === 400) {
      toast.error(data.message);
    } else if (status === 201) {
      toast.success(data.message);
      reset({
        name: "",
        password: "",
        confirmPassword: "",
        address: "",
        age: "",
        dateOfBirth: "",
        gender: "",
        role: "",
        avatar: "",
      });
      loadUser();
      close();
    } else {
      toast.warning(data.message);
    }
  };

  return (
    <>
      <div className="w-screen sm:max-w-xl">
        <Form title="Create Account">
        <label htmlFor="avatarFile" className="w-32 h-auto text-center bg-green-300 rounded-md">
            {avatar ? <img src={process.env.REACT_APP_BASE_STATIC_FILE + avatar} /> : "Upload Avatar"}
          </label>
          <InputField
            id="avatarFile"
            type="file"
            name="avatarFile"
            onChange={onEditChange}
            style={{ display: "none" }}
          />
          <InputField
            type="text"
            placeholder="Fullname"
            {...register("fullname")}
          />
          <ErrorMessage
            name="fullname"
            errors={errors}
            render={({ message }) => <ErrorMessageCustom message={message} />}
          />
          <InputField
            type="text"
            placeholder="Username"
            {...register("username")}
          />
          <ErrorMessage
            name="username"
            errors={errors}
            render={({ message }) => <ErrorMessageCustom message={message} />}
          />

          <InputField
            type="text"
            placeholder="Password"
            {...register("password")}
          />
          <ErrorMessage
            name="password"
            errors={errors}
            render={({ message }) => <ErrorMessageCustom message={message} />}
          />
          <DateTimePicker
            placeholder="Date Of Birth"
            {...register("dateOfBirth")}
            max={`2004-01-01`}
            min={"1950-01-01"}
          />
          <ErrorMessage
            name="dateOfBirth"
            errors={errors}
            render={({ message }) => <ErrorMessageCustom message={message} />}
          />
          <SelectOption
            {...register("gender")}
            defaultValue={getValues("gender")}
            listData={[
              { name: "Male" },
              { name: "Female" },
              { name: "Unknown" },
            ]}
          />
          <SelectOption
            {...register("role")}
            defaultValue={getValues("role")}
            listData={options}
          />
          <Button
            onClick={handleSubmit(onSubmit)}
            role="submit"
            type="primary"
            icon={PlusCircleIcon}
            title="Create"
          />
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
