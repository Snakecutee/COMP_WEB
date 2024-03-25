import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Button from "../../components/button";
import Table from "../../components/table";
import {
  tokenRequestInterceptor,
  getAllUser,
  searchUserByUsername,
  getSingleUser,

  deleteUser,

} from "../../apiServices";
import { getNewToken } from "../../store/actions/authenticateAction";
import Modal from "../../components/modal";
import RegisterPage from "./register";
import DetailPage from "./detail";
import EditUserPage from "./editUser";
import { toast } from "react-toastify";
import {
  IdentificationIcon,
  BackspaceIcon,

  PencilAltIcon,
} from "@heroicons/react/solid";
import { roles } from "../../constants/role";

const userTableHead = [
  "avatar",
  "Fullname",
  "Username",
  "Email",
  "Role",
  "Address",
  "Actions",
];

const UserPage = ({ getNewTokenRequest, token }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

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
        toast.error("Delete User Successfully");
        loadUser();
      }
    };
    dectiveUser();
  };

  const updateHandler = (e, id) => {
    e.preventDefault();
    setUser((prev) => users.find((user) => user.id === id));
    setOpenEdit((prev) => !prev);

  };

  const renderTableHead = (item, index) => (
    <th key={index} className="p-2 whitespace-nowrap">
      <div
        className={`font-semibold ${item.toLowerCase() === "actions" ? "text-center" : "text-left"
          }`}
      >
        {item}
      </div>
    </th>
  );

  const renderTableBody = (item, index) => (
    <tr key={index}>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">
          <img
            src={process.env.REACT_APP_BASE_STATIC_FILE + item.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </td>
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
        <div className="flex gap-3">
          <Button
            icon={IdentificationIcon}
            type="primary"
            title="Detail"
            onClick={(e) => detailHandler(e, item.id)}
          />
          <Button
            onClick={(e) => updateHandler(e, item.id)}
            icon={PencilAltIcon}
            type="warning"
            title="Update"
          />
          <Button
            onClick={(e) => deleteHandler(e, item.id)}
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
          roles={roles}
        />
      </Modal>

      <Modal open={openDetail} setOpen={setOpenDetail}>
        <DetailPage user={user} />
      </Modal>

      <Modal open={openEdit} setOpen={setOpenEdit}>
        <EditUserPage
          close={() => setOpenEdit(!openEdit)}
          token={token}
          userId={user.id}
          getNewTokenRequest={getNewTokenRequest}
          loadUser={loadUser}
        />
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
