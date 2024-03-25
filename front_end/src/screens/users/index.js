import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Button from "../../components/button";
import Table from "../../components/table";
import {
  tokenRequestInterceptor,
  getAllUser,
  searchUserByUsername,
  getSingleUser,
  uploadExcelCreateUser,
  confirmUserExcel,
  cancelUserExcel,
  getUserWithoutDepartment,
  assignSTUDENTToManager,
  deleteUser,
  reactiveUser
} from "../../apiServices";
import { getNewToken } from "../../store/actions/authenticateAction";
import Modal from "../../components/modal";
import Form from "../../components/form";
import RegisterPage from "./register";
import DetailPage from "./detail";
import SpreadSheet from "react-spreadsheet";
import { toast } from "react-toastify";
import {
  IdentificationIcon,
  BackspaceIcon,
  UploadIcon,
  RefreshIcon
} from "@heroicons/react/solid";
import { roles } from "../../constants/role";

const userTableHead = [
  "Fullname",
  "Username",
  "Email",
  "Role",
  "Address",
  "Department",
  "Actions",
];

const UserPage = ({ getNewTokenRequest, token }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [filename, setFilename] = useState("");
  const [userAssign, setUserAssign] = useState([]);

  useEffect(() => {
    if (!openImport) {
      if (data.length > 0) {
        handleCancel();
      } else {
        setFilename("");
        setFile(null);
      }
    }
  }, [openImport, data.length]);

  const loadUser = useCallback(async () => {
    const loadAllDataOfUser = async () => {
      const { data, status } = await getAllUser(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfUser,
      getNewTokenRequest
    );
    if (status === 200) {
      setUsers((prev) => data);
    }
  }, [token, getNewTokenRequest]);

  useEffect(() => {
    loadUser();
    document.title = "Users";
  }, [loadUser]);

  const hangleSearch = (keyword) => {
    if (keyword) {
      const search = async () => {
        const loadAllDataOfSearchUser = async () => {
          const { data, status } = await searchUserByUsername(keyword, token);
          return { data, status };
        };
        const { status, data } = await tokenRequestInterceptor(
          loadAllDataOfSearchUser,
          getNewTokenRequest
        );
        if (status === 200) {
          setUsers((prev) => data);
        }
      };
      search();
    } else {
      loadUser();
    }
  };

  const detailHandler = (e, id) => {
    e.preventDefault();
    console.log(id);
    const loadSingleUser = async () => {
      const loadSingleUser = async () => {
        const { data, status } = await getSingleUser(token, id);
        console.log(data);
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        loadSingleUser,
        getNewTokenRequest
      );

      if (status === 200) {
        setUser((prev) => data);
      }
    };
    loadSingleUser();
    setOpenDetail((prev) => !prev);
  };

  const deleteHandler = (e, id) => {
    e.preventDefault();
   const dectiveUser = async () => {
     const deletedUser = async () => {
       const { data, status } = await deleteUser(token, id);
       return { data, status };
     };
     const { status } = await tokenRequestInterceptor(
       deletedUser,
       getNewTokenRequest
     );

     if (status === 200) {
       toast.error("Deactive User Successfully");
       loadUser();
     }
   };
   dectiveUser();
  };

  const activeAccountHandler = async (e, id) => {
    e.preventDefault();
    const activeUser = async () => {
      const reactiveUserAccount = async () => {
        const { data, status } = await reactiveUser(token, id);
        return { data, status };
      };
      const { status } = await tokenRequestInterceptor(
        reactiveUserAccount,
        getNewTokenRequest
      );

      if (status === 200) {
        toast.error("Reactive User Successfully");
        loadUser();
      }
    };
    activeUser();
  };

  const uploadFile = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const handleUpload = async () => {
    const uploadExcelUser = async () => {
      const formData = new FormData();
      formData.append("file", file);
      const { data, status } = await uploadExcelCreateUser(formData, token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      uploadExcelUser,
      getNewTokenRequest
    );
    if (status === 200) {
      setData(data.data);
    }
  };

  const handleCancel = async (e) => {
    const cancelCreateExcelUser = async () => {
      const { data, status } = await cancelUserExcel(filename, token);
      return { data, status };
    };
    const { status } = await tokenRequestInterceptor(
      cancelCreateExcelUser,
      getNewTokenRequest
    );
    if (status === 200) {
      setOpenImport(false);
      setData([]);
      setFilename("");
      setFile(null);
    }
  };

  const handleCreateUser = async () => {
    const confirmCreateExcelUser = async () => {
      const { data, status } = await confirmUserExcel(filename, token);
      return { data, status };
    };
    const { status } = await tokenRequestInterceptor(
      confirmCreateExcelUser,
      getNewTokenRequest
    );
    if (status === 200) {
      toast.success("Excel import done");
      setOpenImport(false);
      setData([]);
      setFile(null);
      setFilename("");
      loadUser();
    }
  };

  const getWithoutDepartment = async () => {
    const loadAllDataOfUser = async () => {
      const { data, status } = await getUserWithoutDepartment(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfUser,
      getNewTokenRequest
    );
    if (status === 200) {
      setUserAssign((prev) => data);
    }
  };

  const handleAssign = async () => {
    await getWithoutDepartment();
    setOpenAssign(true);
  };

  const assignSTUDENT = async (id) => {
    // e.preventDefault();
    const assignSTUDENTRequest = async () => {
      const { data, status } = await assignSTUDENTToManager(
        { role: roles.QA_MANAGER, department: userAssign.department },
        id,
        token
      );

      return { data, status };
    };

    const { status, data } = await tokenRequestInterceptor(
      assignSTUDENTRequest,
      getNewTokenRequest
    );
    if (status === 200) {
      toast.success(data.message);
      setUserAssign((prev) => ({ role: "", department: "" }));
      setOpenAssign((prev) => !prev);
      loadUser();
    }
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
        <div className="text-left">{item.fullname}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.username}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.email}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.role}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.address}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.department}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="flex gap-3">
          <Button
            icon={IdentificationIcon}
            type="warning"
            title="Detail"
            onClick={(e) => detailHandler(e, item.id)}
          />
          {item.deleted ? (
            <Button
              onClick={(e) => activeAccountHandler(e, item.id)}
              icon={RefreshIcon}
              type="success"
              title="Reactive"
            />
          ) : (
            <Button
              onClick={(e) => deleteHandler(e, item.id)}
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
    <div>
      <Table
        limit={10}
        tableHead={userTableHead}
        tableData={users}
        renderData={renderTableBody}
        renderHead={renderTableHead}
        tableTitle={"User Table"}
        search={hangleSearch}
        createButtonHandler={() => setOpen(true)}
        
        
      />
      <Modal open={open} setOpen={setOpen}>
        <RegisterPage
          close={() => setOpen(!open)}
          loadUser={loadUser}
          token={token}
          getNewTokenRequest={getNewTokenRequest}
        />
      </Modal>

      <Modal open={openDetail} setOpen={setOpenDetail}>
        <DetailPage user={user} />
      </Modal>

      <Modal open={openImport} setOpen={setOpenImport}>
        <div className="flex justify-center w-fit mt-8">
          {data.length ? (
            <div className="w-full">
              <SpreadSheet data={data} />
              <div className="flex justify-center p-2 space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-white bg-red-500 rounded shadow-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 text-white bg-green-500 rounded shadow-xl"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <div className=" lg:w-1/2">
              {filename ? (
                <h2>{filename}</h2>
              ) : (
                <div className="m-10">
                  <label className="inline-block mb-2 text-gray-500">
                    Upload Excel File (.xlsx)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                      <div class="flex flex-col items-center justify-center pt-7">
                        <UploadIcon
                          width="100"
                          height="100"
                          className="text-gray-400"
                        />
                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                          Select a file
                        </p>
                      </div>
                      <input
                        type="file"
                        value={file}
                        className="opacity-0"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={uploadFile}
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-center p-2 space-x-4">
                <button
                  onClick={handleUpload}
                  disabled={!file ? true : false}
                  className="px-4 py-2 text-white bg-green-500 rounded shadow-xl disabled:cursor-not-allowed"
                >
                  Upload
                </button>
              </div>
            </div>
          )}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
