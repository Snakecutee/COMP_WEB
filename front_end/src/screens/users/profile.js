import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getNewToken } from "../../store/actions/authenticateAction";
import { connect } from "react-redux";
import Button from "../../components/button";
import { IdentificationIcon } from "@heroicons/react/solid";
import Modal from "../../components/modal";
import EditUserPage from "./editUser";
import {
  getSingleUser,
  tokenRequestInterceptor,
} from "../../apiServices/index";
import avatar from "../../assets/logo.png";


const Profile = ({ close, userId, token, getNewTokenRequest }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});

  const updateHandler = (e) => {
    e.preventDefault();
    setOpen((prev) => !prev);
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
      setUser(data);
    }
  }, [token, getNewTokenRequest, userId, setUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dateFormatter = (day) => {
    const d = new Date(day);
    var datestring =
      d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    return datestring;
  };

  return (
    <>
      <div className="flex items-center justify-center p-20">
        <div className="bg-white w-100 rounded-lg">
          <div className="flex items-center justify-center pt-10 flex-col">
            <div className="shrink-0">
              <img
                src={avatar}
                className="rounded-full w-40"
                alt="Avatar"
              />
            </div>
            <h1 className="text-gray-800 font-semibold text-xl mt-5">
              {user.fullname}
            </h1>
            <h1 className="text-gray-500 text-sm">{user.email}</h1>
          </div>
          <div className="flex justify-between p-4">
            <div>
              <h1 className="text-xs uppercase text-gray-500">Date Of Birth</h1>
              <h1 className="text-xs text-yellow-500">
                {dateFormatter(user.dateOfBirth)}
              </h1>
            </div>
          </div>
          <div className="flex justify-between p-4">
            <div>
              <h1 className="text-xs uppercase text-gray-500">Age</h1>
              <h1 className="text-xs text-yellow-500">{user.age}</h1>
            </div>
          </div>
          <div className="flex justify-between p-4">
            <div>
              <h1 className="text-xs uppercase text-gray-500">Address</h1>
              <h1 className="text-xs text-yellow-500">{user.address}</h1>
            </div>
          </div>
          <div className="flex justify-between p-4">
            <div>
              <h1 className="text-xs uppercase text-gray-500">Gender</h1>
              <h1 className="text-xs text-yellow-500">{user.gender}</h1>
            </div>
          </div>
          <div className="flex justify-between p-4">
            <div>
              <h1 className="text-xs uppercase text-gray-500">Role</h1>
              <h1 className="text-xs text-yellow-500">{user.role}</h1>
            </div>
          </div>
          <div className="flex items-center justify-center mt-3 mb-6 flex-col">
            <Button
              icon={IdentificationIcon}
              type="warning"
              title="Update"
              onClick={(e) => updateHandler(e)}
            />
          </div>
        </div>
      </div>
      <Modal open={open} setOpen={setOpen}>
        <EditUserPage close={() => setOpen(!open)} userId={userId} />
      </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
