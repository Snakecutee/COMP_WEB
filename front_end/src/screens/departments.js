import React, { useState, useEffect, useCallback } from "react";
import Form from "../components/form";
import InputField from "../components/inputField";
import Button from "../components/button";
import Table from "../components/table";
import Modal from "../components/modal";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createDepartment,
  getAllDepartment,
  tokenRequestInterceptor,
  updateDepartment,
  findDepartmentByID,
  searchDepartByName,
  deleteDepartment,
  reactiveDepartment,
} from "../apiServices";
import { toast } from "react-toastify";
import { ErrorMessage } from "@hookform/error-message";
import ErrorMessageCustom from "../components/errorMessage";
import { getNewToken } from "../store/actions/authenticateAction";
import { subRouterUpdate } from "../store/actions/subRouterAction";
import {
  PencilAltIcon,
  BackspaceIcon,
  XCircleIcon,
  PlusCircleIcon,
  RefreshIcon,
} from "@heroicons/react/solid";
import TextArea from "../components/text-area";
import TextAreaField from "../components/text-area";

const userTableHead = ["Name", "Description", "Actions"];

const departmentFormValidationSchema = yup.object({
  name: yup.string().required("Name must be filled").max(50),
  description: yup.string().required("Description must be filled").max(200),
});

function Departments({ getNewTokenRequest, token, updateRouter }) {
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState({});
  const [departmentDelete, setDepartmentDelete] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);

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
    }
  }, [token, getNewTokenRequest]);

  useEffect(() => {
    loadDepartment();
    document.title = "Departments";
  }, [loadDepartment]);

  const hangleSearch = async (name) => {
    const loadAllDataOfDepartment = async () => {
      const { data, status } = await searchDepartByName(name, token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfDepartment,
      getNewTokenRequest
    );
    if (status === 200) {
      setDepartments((prev) => data);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(departmentFormValidationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const toggle = (e) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };

  const onSubmit = async (formdata) => {
    const createDataofDepartment = async () => {
      const { status, data } = await createDepartment(formdata, token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      createDataofDepartment,
      getNewTokenRequest
    );
    if (status === 201) {
      toast.success("Create success");
      reset({ name: "", description: "" });
      setOpen((prev) => !prev);
      loadDepartment();
      updateRouter();
    } else {
      toast.error(data.message);
    }
  };

  //Update
  const update = async (e) => {
    e.preventDefault();
    if (editDepartment?.description === "") {
      toast.error("description cannot be empty");
      return;
    }
    const updateDepart = async () => {
      const { data, status } = await updateDepartment(
        editDepartment,
        editDepartment._id,
        token
      );
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      updateDepart,
      getNewTokenRequest
    );

    if (status === 200) {
      toast.success(data.message);
      setEditDepartment((prev) => {});
      loadDepartment();
      setEditOpen((prev) => !prev);
    }
  };

  //Delete
  const deleteDep = async (event) => {
    event.preventDefault();
    const deleteDepart = async () => {
      const { data, status } = await deleteDepartment(
        token,
        departmentDelete._id
      );
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      deleteDepart,
      getNewTokenRequest
    );
    if (status === 200) {
      toast.success(data.message);
      loadDepartment();
      setDeleteOpen((prev) => !prev);
    }
    if (status === 400) {
      toast.error(data.message);
    }
  };

  const handleDelete = (e, item) => {
    e.preventDefault();

    setDeleteOpen((prev) => !prev);

    setDepartmentDelete(item);
  };

  const activeDepartmentHandler = async (e, id) => {
    const { status } = await reactiveDepartment(token, id);
    if (status === 200) {
      loadDepartment();
    }
  };

  const editHandler = (e, _id) => {
    e.preventDefault();
    const getSingleDepartment = async () => {
      const loadAllDataOfDepartment = async () => {
        const { data, status } = await findDepartmentByID(token, _id);
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        loadAllDataOfDepartment,
        getNewTokenRequest
      );

      if (status === 200) {
        setEditDepartment((prev) => data.data);
      }
    };
    getSingleDepartment();
    setEditOpen((prev) => !prev);
  };

  const onEditChange = (e) => {
    setEditDepartment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const renderTableHead = (item, index) => (
    <th
      key={index}
      className={`p-2 ${
        item.toLowerCase() !== "actions"
          ? "whitespace-nowrap"
          : "flex justify-center"
      }`}
    >
      <div
        className={`font-semibold ${
          item.toLowerCase() === "actions" ? "text-center w-fit" : "text-left"
        }`}
      >
        {item}
      </div>
    </th>
  );

  const renderTableBody = (item, index) => (
    <tr key={index}>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.name}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.description}</div>
      </td>
      <td className="p-2 w-full flex justify-center">
        <div className="w-full flex gap-3 justify-center">
          <Button
            icon={PencilAltIcon}
            type="warning"
            title="Edit"
            onClick={(e) => editHandler(e, item._id)}
          />
          {item.deleted ? (
            <Button
              onClick={(e) => activeDepartmentHandler(e, item._id)}
              icon={RefreshIcon}
              type="success"
              title="Reactive"
            />
          ) : (
            <Button
              onClick={(e) => handleDelete(e, item)}
              icon={BackspaceIcon}
              type="danger"
              title="Deactive"
            />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      <Table
        limit={10}
        tableHead={userTableHead}
        tableData={departments}
        renderData={renderTableBody}
        renderHead={renderTableHead}
        tableTitle={"Department Table"}
        createButtonHandler={() => setOpen(true)}
        search={hangleSearch}
      />

      <Modal open={editOpen} setOpen={setEditOpen}>
        <div className="w-screen sm:max-w-lg">
          <Form title="Update Department">
            <TextAreaField
              type="text"
              placeholder="Description"
              name="description"
              rows={4}
              value={editDepartment?.description}
              onChange={onEditChange}
            />
            <div className="w-3/5 flex flex-wrap justify-between items-center">
              <Button
                onClick={update}
                icon={PencilAltIcon}
                role="submit"
                type="primary"
                title="Update"
              />
              <Button
                type="danger"
                icon={XCircleIcon}
                title="Cancel"
                onClick={(e) => {
                  e.preventDefault();
                  setEditOpen(false);
                }}
              />
            </div>
          </Form>
        </div>
      </Modal>

      <Modal open={open} setOpen={setOpen}>
        <div className="w-screen sm:max-w-lg">
          <Form title="Create Department">
            <InputField type="text" placeholder="Name" {...register("name")} />
            <ErrorMessage
              name="name"
              errors={errors}
              render={({ message }) => <ErrorMessageCustom message={message} />}
            />
            <TextArea
              type="text"
              rows={4}
              placeholder="Description"
              {...register("description")}
            />
            <ErrorMessage
              name="description"
              errors={errors}
              render={({ message }) => <ErrorMessageCustom message={message} />}
            />
            <div className="w-3/5 flex flex-wrap justify-between items-center">
              <Button
                onClick={handleSubmit(onSubmit)}
                role="submit"
                icon={PlusCircleIcon}
                type="primary"
                title="Create"
              />
              <Button
                icon={XCircleIcon}
                type="danger"
                title="Cancel"
                onClick={toggle}
              />
            </div>
          </Form>
        </div>
      </Modal>
      <Modal open={deleteOpen} setOpen={setDeleteOpen}>
        <div className="w-screen sm:max-w-lg">
          <Form title="Deactive Department">
            <div className="w-3/5 flex flex-wrap justify-between items-center">
              <h4
                style={{
                  color: "red",
                  fontSize: "17px",
                  paddingBottom: "10px",
                }}
              >
                Are you sure you want to deactive ?
              </h4>

              <Button
                onClick={deleteDep}
                role="submit"
                icon={BackspaceIcon}
                type="danger"
                title="Delete"
              />
              <Button
                icon={XCircleIcon}
                type="primary"
                title="Cancel"
                onClick={handleDelete}
              />
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.authenticateReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
    updateRouter: () => dispatch(subRouterUpdate()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Departments);
