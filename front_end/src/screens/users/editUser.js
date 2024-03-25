import React, { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import {
  getSingleUser,
  tokenRequestInterceptor,
  updateUser,
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
import { PlusCircleIcon } from "@heroicons/react/solid";
import { getNewToken } from "../../store/actions/authenticateAction";
import { connect } from "react-redux";
import { roles } from "../../constants/role";

const editFormValidationSchema = yup.object({
  fullname: yup.string().required("Fullname must be filled"),
  age: yup
    .number()
    .required("Please supply your age")
    .min(1, "You must be at least 1 years")
    .max(100, "You must be at most 100 years"),
  address: yup.string().required("Address must be filled").max(500),
  dateOfBirth: yup
    .date()
    .required("Date of Birth is required")
    .min(new Date(1950, 0, 1))
    .max(new Date(2004, 0, 1)),
});

const initial = {
  dateOfBirth: "",
  gender: "Male",
  fullname: "",
  age: "",
  role: "",
  address: "",
  avatar: "",
};
const options = roles.ALL.map((role) => ({ name: role }));
const EditUserPage = ({ close, userId, token, getNewTokenRequest, loadUser }) => {
  const [user, setUser] = useState(initial);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(editFormValidationSchema),
    defaultValues: {
      dateOfBirth: "",
      gender: "Male",
      fullname: "",
      password: "",
      confirmPassword: "",
      age: "",
      role: "",
      address: "",
      avatar: "",
    },
  });

  useEffect(() => {
    register("dateOfBirth");
    register("gender");
    register("fullname");
    register("password");
    register("confirmPassword");
    register("age");
    register("role");
    register("address");
    register("avatar");
  }, [register]);

  const onEditChange = (e) => {
    if(e.target.name === "avatarFile"){
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const upload = async () => {
        const { status, data } = await uploadImage(formData);
        if (status === 200) {
          setValue("avatar", data.path);
          console.log(data.path);
          setUser((prev) => ({ ...prev, avatar: data.path }));
        }
      };
      upload();
    }else{
      //setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const loadData = useCallback(async () => {
    const loadDataOfUser = async () => {
      const { data, status } = await getSingleUser(token, userId);
      return { data, status };
    };

    const { status, data } = await tokenRequestInterceptor(
      loadDataOfUser,
      getNewTokenRequest
    );
    if (status === 200) {
      setValue("fullname", data.fullname);
      setValue("dateOfBirth", data?.dateOfBirth.slice(0, 10));
      setValue("gender", data.gender);
      setValue("age", data.age);
      setValue("address", data.address);
      setValue("role", data.role || "");
      setValue("avatar", data.avatar || "");
    }
  }, [token, getNewTokenRequest, userId, setValue]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (formData) => {
    const { status, data } = await updateUser(formData, userId, token);
    if (status === 400) {
      toast.error(data.message);
    } else if (status === 200) {
      toast.success("Update User Successfully");
      loadUser()
      reset({
        dateOfBirth: "",
        gender: "Male",
        fullname: "",
        password: "",
        confirmPassword: "",
        age: "",
      });
      close();
    } else {
      toast.warning(data.message);
    }
  };

  return (
    <>
      <div className="w-screen sm:max-w-xl">
        <Form title="Edit Account">
          <label htmlFor="avatarFile" className="w-32 h-auto text-center bg-green-300 rounded-md">
            {user.avatar ? <img src={process.env.REACT_APP_BASE_STATIC_FILE + user.avatar} /> : "Upload Avatar"}
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
            name="fullname"
            onChange={onEditChange}
            {...register("fullname")}
          />
          <ErrorMessage
            name="fullname"
            errors={errors}
            render={({ message }) => <ErrorMessageCustom message={message} />}
          />
          <InputField
            type="number"
            placeholder="Age"
            name="age"
            onChange={onEditChange}
            {...register("age")}
          />
          <ErrorMessage
            name="age"
            errors={errors}
            render={({ message }) => <ErrorMessageCustom message={message} />}
          />
          <InputField
            type="text"
            name="address"
            onChange={onEditChange}
            placeholder="Address"
            {...register("address")}
          />
          <ErrorMessage
            name="address"
            errors={errors}
            render={({ message }) => <ErrorMessageCustom message={message} />}
          />
          <DateTimePicker
            placeholder="Date Of Birth"
            name="dateOfBirth"
            onChange={onEditChange}
            {...register("dateOfBirth")}
            max={"2004-01-01"}
            min={"1950-01-01"}
          />
          <ErrorMessage
            name="dateOfBirth"
            errors={errors}
            render={({ message }) => <ErrorMessageCustom message={message} />}
          />
          <SelectOption
            {...register("gender")}
            defaultValue={getValues("gender") || ""}
            name="gender"
            onChange={onEditChange}
            listData={[
              { name: "Male" },
              { name: "Female" },
              { name: "Unknown" },
            ]}
          />
          <SelectOption
            {...register("role")}
            defaultValue={getValues("role")}
            name="role"
            onChange={onEditChange}
            listData={[
              { name: roles.QA_COORDINATOR },
              { name: roles.QA_MANAGER },
              { name: roles.STUDENT },
              { name: roles.ADMIN },
            ]}
          />

          <Button
            onClick={handleSubmit(onSubmit)}
            role="submit"
            type="primary"
            icon={PlusCircleIcon}
            title="Update"
          />
        </Form>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.authenticateReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditUserPage);
