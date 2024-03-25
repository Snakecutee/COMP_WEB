import React, { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import {
  register as registerApi,
  getAllDepartment,
  tokenRequestInterceptor,
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
  // password: yup
  //   .string()
  //   .required("No password provided.")
  //   .min(8, "Password is too short - should be 8 chars minimum.")
  //   .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref("password"), null], "Passwords must match"),
  // age: yup
  //   .number()
  //   .required("Please supply your age")
  //   .min(1, "You must be at least 1 years")
  //   .max(100, "You must be at most 100 years"),
  // address: yup.string().required("Address must be filled").max(500),
  dateOfBirth: yup
    .date()
    .required("Date of Birth is required")
    .min(new Date(1950, 0, 1), "Your Birthday cannot before 1/1/1950")
    .max(new Date(2004, 0, 1), "Your Birthday cannot after 1/1/2004"),
});


const RegisterPage = ({ close, loadUser, token, getNewTokenRequest }) => {
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
      department: "",
    },
  });

  const [departments, setDepartments] = useState([]);

  const loadDepartment = useCallback(async () => {
    const loadAllDataOfDepartment = async () => {
      const { data, status } = await getAllDepartment(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfDepartment,
      getNewTokenRequest
    );
    if (status === 200) {
      setDepartments((prev) => data);
      setValue("department", data[0].name);
    }
  }, [token, setValue, getNewTokenRequest]);



  useEffect(() => {
    loadDepartment();
  }, [loadDepartment]);

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
            {...register("department")}
            defaultValue={getValues("department")}
            listData={departments.filter((item) => !item.deleted)}
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
