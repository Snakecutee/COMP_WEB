import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Button from "../../components/button";
import Form from "../../components/form";
import DateTimePicker from "../../components/DateTimePicker";
import CreateAcademicYear from "../../components/CreateAcademicYear";
import UpdateAcademicYear from "../../components/UpdateAcademicYear";
import Table from "../../components/table";
import { getNewToken } from "../../store/actions/authenticateAction";
import Modal from "../../components/modal";
import { toast } from "react-toastify";
import {
  createAcademic,
  tokenRequestInterceptor,
  getAllAcademic,
  getAcademicById,
  deleteAcademy,
  updateAcademic,
} from "../../apiServices/";
import {
  PlusCircleIcon,
  PencilAltIcon,
  BackspaceIcon,
} from "@heroicons/react/solid";
import InputField from "../../components/inputField";
import ErrorMessageCustom from "../../components/errorMessage";

const academicTableHead = [
  "Name",
  "Description",
  "StartDate",
  "ClosureDate",
  "EndDate",
  "Actions",
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
  closureDate: "",
  description: "",
};

const AcademicPage = ({ getNewTokenRequest, token }) => {
  const [academic, setAcademic] = useState([]);
  const [openAcademy, setOpenAcademy] = useState(false);
  const [openUpdateAcademy, setOpenUpdateAcademy] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(dateInitial);
  const [description, setDescription] = useState("");

  const [editAcademicYearId, setEditAcademicYearId] = useState("");
  const [closureDate, setClosureDate] = useState(new Date());
  const [errors, setErrors] = useState(errorInitial);

  useEffect(() => {
    loadAcademy();
  }, []);

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
    temp.closureDate =
      closureDate !== undefined ? "" : "This field is required";
    temp.closureDate =
      new Date(date[0].startDate).getTime() < new Date(closureDate).getTime() &&
      new Date(closureDate).getTime() < new Date(date[0].endDate).getTime()
        ? ""
        : "Closure date need after start date and befor end date";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      const createOfAcademic = async () => {
        const { status, data } = await createAcademic(
          {
            name: name,
            startDate: date[0].startDate,
            endDate: date[0].endDate,
            description: description,
            closureDate: closureDate,
          },
          token
        );
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        createOfAcademic,
        getNewTokenRequest
      );
      if (status === 200) {
        toast.success("Create success");
        setName("");
        setDescription("");
        setDate(dateInitial);
        setClosureDate(new Date());
        setOpenAcademy(false);
        setErrors(errorInitial);
        loadAcademy();
      } else {
        toast.error(data.message);
      }
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      const updateOfAcademic = async () => {
        const { status, data } = await updateAcademic(
          {
            name: name,
            description: description,
            startDate: date[0].startDate,
            endDate: date[0].endDate,
            closureDate: closureDate,
          },
          editAcademicYearId,
          token
        );
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        updateOfAcademic,
        getNewTokenRequest
      );
      if (status === 200) {
        toast.success("Update success");
        setName("");
        setDescription("");
        setDate(dateInitial);
        setClosureDate(new Date());
        setOpenUpdateAcademy(false);
        setErrors(errorInitial);
        loadAcademy();
      } else {
        toast.error(data.message);
      }
    }
  };

  const dateFormatter = (day) => {
    const d = new Date(day);
    var datestring =
      d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    return datestring;
  };

  const editHandler = (e, _id) => {
    e.preventDefault();
    setEditAcademicYearId(_id);
    const getSingleAcademicYear = async () => {
      const loadDataOfAcademicYear = async () => {
        const { data, status } = await getAcademicById(token, _id);
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        loadDataOfAcademicYear,
        getNewTokenRequest
      );

      if (status === 200) {
        setName(data.name);
        setDescription(data.description);
        setClosureDate(new Date(data.closureDate));

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
    getSingleAcademicYear();
    setOpenUpdateAcademy((prev) => !prev);
  };

  const deleteHandler = (e, id) => {
    e.preventDefault();
    const deleteMagazine = async () => {
      const deletedMagazine = async () => {
        const { data, status } = await deleteAcademy(token, id);
        return { data, status };
      };
      const { status } = await tokenRequestInterceptor(
        deletedMagazine,
        getNewTokenRequest
      );

      if (status === 200) {
        toast.error("Delete User Successfully");
        loadAcademy();
      }
    };
    deleteMagazine();
  };

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

  const renderTableBody = (item, index) => (
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
        <div className="text-left">{dateFormatter(item.closureDate)}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{dateFormatter(item.endDate)}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left flex justify-center gap-3 w-fit">
          <Button
            icon={PencilAltIcon}
            type="primary"
            title="Edit"
            onClick={(e) => editHandler(e, item._id)}
          />
          <Button
            onClick={(e) => deleteHandler(e, item._id)}
            icon={BackspaceIcon}
            type="danger"
            title="Delete"
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <Table
        limit={20}
        tableHead={academicTableHead}
        tableData={academic}
        renderData={renderTableBody}
        renderHead={renderTableHead}
        tableTitle={"Academic Table"}
        createButtonHandler={() => setOpenAcademy(true)}
      />
      <Modal open={openAcademy} setOpen={setOpenAcademy}>
        <div className="w-screen sm:max-w-xl">
          <Form title="Create Academy">
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
            <label className="mr-auto text-xl text-900">Closure Date</label>
            <DateTimePicker
              value={closureDate.toLocaleDateString("en-CA")}
              onChange={(e) => setClosureDate(new Date(e.target.value))}
            />
            {errors.closureDate.length > 0 && (
              <ErrorMessageCustom message={errors.closureDate} />
            )}
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
      <Modal open={openUpdateAcademy} setOpen={setOpenUpdateAcademy}>
        <Form title="Edit Academy">
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
          <label className="mr-auto text-xl text-900">Closure Date</label>
          <DateTimePicker
            value={closureDate.toLocaleDateString("en-CA")}
            onChange={(e) => setClosureDate(new Date(e.target.value))}
          />
          {errors.closureDate.length > 0 && (
            <ErrorMessageCustom message={errors.closureDate} />
          )}
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
    token: state.authenticateReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicPage);
