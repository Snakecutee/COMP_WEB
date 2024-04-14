import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/button";
import Table from "../../components/table";
import Form from "../../components/form";
import Modal from "../../components/modal";
import { toast } from "react-toastify";
import { roles } from "../../constants/role";
import { getNewToken } from "../../store/actions/authenticateAction";
import InputField from "../../components/inputField";
import CreateAcademicYear from "../../components/CreateAcademicYear";
import UpdateAcademicYear from "../../components/UpdateAcademicYear";

import ErrorMessageCustom from "../../components/errorMessage";
import {
  getAllMagazine,
  getMagazineByDepartment,
  tokenRequestInterceptor,
  getAllDepartment,
  getAllAcademic,
  createMagazine,
  getMagazineById,
  updateMagazine,
  deleteMagazing,
} from "../../apiServices";
import { connect } from "react-redux";
import {
  IdentificationIcon,
  BackspaceIcon,
  PencilAltIcon,
  PlusCircleIcon,
} from "@heroicons/react/solid";
import SelectOption from "../../components/SelectOption";
import { useNavigate } from "react-router-dom";

const magazineTableHead = [
  "Name",
  "Descrition",
  "Start Date",
  "End Date",
  "Department",
  "Academy",
  "Action",
];

const dateInitial = [
  {
    startDate: new Date(),
    endDate: null,
    key: "selection",
  },
];

const errorInitial = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  department: "",
  academy: "",
};
const MagazinePage = ({ getNewTokenRequest, authenticateReducer }) => {
  const [magazines, setMagazines] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [departments, setDeparments] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState(dateInitial);
  const [description, setDescription] = useState("");
  const [defaultDepartment, setDefaultDepartment] = useState("");
  const [defaultAcademy, setDefaultAcademy] = useState("");
  const [openUpdateMagazine, setOpenUpdateMagazine] = useState(false);

  const [editMagazineId, setEditMagazineId] = useState("");
  const [errors, setErrors] = useState(errorInitial);

  const { token, user } = authenticateReducer;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const loadAcademy = async () => {
    const getAcademic = async () => {
      const { status, data } = await getAllAcademic(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      getAcademic,
      getNewTokenRequest
    );
    if (status === 200) {
      setAcademic(data);
      if (!openUpdateMagazine) setDefaultAcademy(data[0].name);
    } else {
      toast.error(data.message);
    }
  };

  const loadMagazine = async () => {
    const getOfMagazine = async () => {
      if (user.role === roles.STUDENT) {
        const { data, status } = await getMagazineByDepartment(token);
        return { data, status };
      } else {
        const { status, data } = await getAllMagazine(token);
        return { data, status };
      }
    };
    const { status, data } = await tokenRequestInterceptor(
      getOfMagazine,
      getNewTokenRequest
    );
    if (status === 200) {
      setMagazines(data);
    } else {
      toast.error(data.message);
    }
  };

  const loadDepartment = async () => {
    const getDepartment = async () => {
      const { status, data } = await getAllDepartment(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      getDepartment,
      getNewTokenRequest
    );
    if (status === 200) {
      setDeparments(data);
      if (!openUpdateMagazine) setDefaultDepartment(data[0].name);
    } else {
      toast.error(data.message);
    }
  };

  const validation = () => {
    let temp = {};
    temp.name = name !== "" ? "" : "This name field is required";
    temp.description =
      description !== "" ? "" : "This description field is required";

    temp.startDate =
      date[0].startDate !== undefined
        ? ""
        : "This start date field is required";
    temp.endDate =
      date[0].endDate !== undefined ? "" : "This endDate field is required";
    temp.endDate =
      new Date(date[0].startDate).getTime() <
      new Date(date[0].endDate).getTime()
        ? ""
        : "EndDate need after start date";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      const createOfMagazine = async () => {
        const { status, data } = await createMagazine(
          {
            name: name,
            startDate: date[0].startDate,
            endDate: date[0].endDate,
            description: description,
            department: defaultDepartment,
            academy: defaultAcademy,
          },
          token
        );
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        createOfMagazine,
        getNewTokenRequest
      );
      if (status === 201) {
        toast.success("Create success");
        setName("");
        setDescription("");
        setDate(dateInitial);
        setOpen(false);
        setErrors(errorInitial);
        loadMagazine();
      } else {
        toast.error(data.message);
      }
    }
  };

  useEffect(() => {
    loadMagazine();
    loadAcademy();
    loadDepartment();
    document.title = "Magazine";
  }, [user._id]);

  const renderTableHead = (item, index) => (
    <th key={index} className="p-2 whitespace-nowrap">
      <div
        className={`font-semibold ${
          item.toLowerCase() === "actions" ? "text-center" : "text-left"
        }`}
      >
        {item}
      </div>
    </th>
  );

  const editHandler = (e, _id) => {
    e.preventDefault();
    setEditMagazineId(_id);
    const getSingleMagazine = async () => {
      const loadDataOfMagazine = async () => {
        const { data, status } = await getMagazineById(token, _id);
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        loadDataOfMagazine,
        getNewTokenRequest
      );

      if (status === 200) {
        setName(data.name);
        setDescription(data.description);
        setDefaultAcademy(data.academy.name);
        setDefaultDepartment(data.department.name);
        const date = [
          {
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            key: "selection",
          },
        ];
        setDate(date);
      }
    };
    getSingleMagazine();
    setOpenUpdateMagazine((prev) => !prev);
  };

  const dateFormatter = (day) => {
    const d = new Date(day);
    var datestring =
      d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    return datestring;
  };

  const deleteHandler = (e, id) => {
    e.preventDefault();
    const deleteMagazine = async () => {
      const deletedMagazine = async () => {
        const { data, status } = await deleteMagazing(token, id);
        return { data, status };
      };
      const { status } = await tokenRequestInterceptor(
        deletedMagazine,
        getNewTokenRequest
      );

      if (status === 200) {
        toast.error("Delete User Successfully");
        loadMagazine();
      }
    };
    deleteMagazine();
  };

  const renderTableBody = (item, index) =>
    user?.role === roles.MARKETING_MANAGER ? (
      <tr key={index}>
        <td className="p-2 whitespace-nowrap">
          <div className="text-left">{item.name}</div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="text-left">{item.description}</div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="text-left">{dateFormatter(item.startDate)}</div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="text-left">{dateFormatter(item.endDate)}</div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="text-left">{item.department.name}</div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="text-left">{item.academy.name}</div>
        </td>
        <td className="p-2 whitespace-nowrap">
          <div className="flex gap-3">
            <Button
              icon={IdentificationIcon}
              type="primary"
              title="Detail"
              onClick={(e) => navigate(`/magazines/${item._id}`)}
            />

            <>
              <Button
                onClick={(e) => editHandler(e, item._id)}
                icon={PencilAltIcon}
                type="warning"
                title="Update"
              />
              <Button
                onClick={(e) => deleteHandler(e, item._id)}
                icon={BackspaceIcon}
                type="danger"
                title="Delete"
              />
            </>
          </div>
        </td>
      </tr>
    ) : (
      user?.department === item.department.name && (
        <tr key={index}>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.name}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.description}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{dateFormatter(item.startDate)}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{dateFormatter(item.endDate)}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.department.name}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.academy.name}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="flex gap-3">
              <Button
                icon={IdentificationIcon}
                type="primary"
                title="Detail"
                onClick={(e) => navigate(`/magazines/${item._id}`)}
              />
              {user?.role === roles.MARKETING_MANAGER && (
                <>
                  <Button
                    onClick={(e) => editHandler(e, item._id)}
                    icon={PencilAltIcon}
                    type="warning"
                    title="Update"
                  />
                  <Button
                    onClick={(e) => deleteHandler(e, item._id)}
                    icon={BackspaceIcon}
                    type="danger"
                    title="Delete"
                  />
                </>
              )}
            </div>
          </td>
        </tr>
      )
    );

  const onDepartmentChange = (e) => {
    e.preventDefault();
    setDefaultDepartment(e.target.value);
  };

  const onAcademyChange = (e) => {
    e.preventDefault();
    setDefaultAcademy(e.target.value);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      const updateOfMagazine = async () => {
        const { status, data } = await updateMagazine(token, {
          id: editMagazineId,
          name: name,
          description: description,
          startDate: date[0].startDate,
          endDate: date[0].endDate,
          department: defaultDepartment,
          academy: defaultAcademy,
        });
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        updateOfMagazine,
        getNewTokenRequest
      );
      if (status === 201) {
        toast.success("Update success");
        setName("");
        setDescription("");
        setDate(dateInitial);
        setOpenUpdateMagazine(false);
        setErrors(errorInitial);
        loadMagazine();
      } else {
        toast.error(data.message);
      }
    }
  };
  return (
    <div>
      {user.role !== roles.MARKETING_MANAGER ? (
        <Table
          limit={10}
          tableHead={magazineTableHead}
          tableData={magazines}
          renderData={renderTableBody}
          renderHead={renderTableHead}
          tableTitle={"Academic Table"}
        />
      ) : (
        <Table
          limit={10}
          tableHead={magazineTableHead}
          tableData={magazines}
          renderData={renderTableBody}
          renderHead={renderTableHead}
          tableTitle={"Academic Table"}
          createButtonHandler={() => setOpen(true)}
        />
      )}

      <Modal open={open} setOpen={setOpen}>
        <div className="w-screen sm:max-w-xl">
          <Form title="Create Magazine">
            <label className="mr-auto text-xl text-900">Name</label>
            <InputField
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name.length > 0 && (
              <ErrorMessageCustom message={errors.name} />
            )}
            <label className="mr-auto text-xl text-900">Description</label>
            <InputField
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description.length > 0 && (
              <ErrorMessageCustom message={errors.description} />
            )}
            <label className="mr-auto text-xl text-900">Start-End Date</label>
            <CreateAcademicYear date={date} setDate={setDate} />
            {errors.startDate.length > 0 && (
              <ErrorMessageCustom message={errors.startDate} />
            )}
            {errors.endDate.length > 0 && (
              <ErrorMessageCustom message={errors.endDate} />
            )}
            <SelectOption
              defaultValue={defaultDepartment}
              listData={departments.filter((item) => !item.deleted)}
              onChange={onDepartmentChange}
            />
            <SelectOption
              defaultValue={defaultAcademy}
              listData={academic.filter((item) => !item.deleted)}
              onChange={onAcademyChange}
            />
            <Button
              onClick={handleSubmit}
              role="submit"
              type="primary"
              icon={PlusCircleIcon}
              title="Create"
            />
          </Form>
        </div>
      </Modal>
      <Modal open={openUpdateMagazine} setOpen={setOpenUpdateMagazine}>
        <Form title="Edit Magazine">
          <label className="mr-auto text-xl text-900">Name</label>
          <InputField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="mr-auto text-xl text-900">Description</label>
          <InputField
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.name.length > 0 && (
            <ErrorMessageCustom message={errors.name} />
          )}
          <label className="mr-auto text-xl text-900">Start-End Date</label>
          <UpdateAcademicYear date={date} setDate={setDate} />
          {errors.startDate.length > 0 && (
            <ErrorMessageCustom message={errors.startDate} />
          )}
          {errors.endDate.length > 0 && (
            <ErrorMessageCustom message={errors.endDate} />
          )}
          <SelectOption
            defaultValue={defaultDepartment}
            listData={departments.filter((item) => !item.deleted)}
            onChange={onDepartmentChange}
          />
          <SelectOption
            defaultValue={defaultAcademy}
            listData={academic.filter((item) => !item.deleted)}
            onChange={onAcademyChange}
          />
          <Button
            onClick={handleUpdateSubmit}
            role="submit"
            type="primary"
            icon={PencilAltIcon}
            title="Update"
          />
        </Form>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MagazinePage);
