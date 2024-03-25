import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChartPieIcon,
  DocumentDuplicateIcon,
  UserIcon,
  UserGroupIcon,
  LogoutIcon,
  CalendarIcon,
  DuplicateIcon,
  DocumentIcon
} from "@heroicons/react/solid";
import { connect } from "react-redux";
import { logout } from "../store/actions/authenticateAction";
import { subRouterUpdate } from "../store/actions/subRouterAction";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Modal from "./modal";
import Profile from "../screens/users/profile";
import {roles} from '../constants/role'
import avatar from '../assets/logo.png'

const SideBar = ({
  authenticateReducer,
  doLogout,
  getAllDepartment,
  subRouterReducer,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = authenticateReducer;
  const { departmentRouters, categoryRouters } = subRouterReducer;

  const [departmentToggle, setDepartmentToggle] = useState(false);

  const [categoryToggle, setCategoryToggle] = useState(false);

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const handleDepToggle = (e) => {
    setDepartmentToggle((prev) => !prev);
    setCategoryToggle(false);
  };

  const handleCateToggle = (e) => {
    setCategoryToggle((prev) => !prev);
    setDepartmentToggle(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    doLogout();
    navigate("/login");
  };

  useEffect(() => {
    getAllDepartment(token);
  }, [getAllDepartment, token]);

  const editUserHandler = (e, id) => {
    e.preventDefault();
    setUserId(id);
    setOpen((prev) => !prev);
  };

  return (
    <>
      <aside
        className="w-full md:h-full bg-gray-800 shadow-2xl"
        aria-label="Sidebar"
      >
        <div className="w-full px-3 py-4 overflow-y-auto rounded">
          <ul className="w-full flex items-center justify-evenly md:flex-col md:items-start">
            <li
              className="w-full h-fit flex sm:flex-row flex-col items-center justify-center cursor-pointer"
              onClick={(e) => editUserHandler(e, authenticateReducer?.user?.id)}
            >
              <div className="shrink-0">
                <img src={avatar} className="rounded-full w-10" alt="Avatar" />
              </div>
              <div className="grow ml-3">
                  <p className="hidden sm:inline-block text-sm font-semibold text-blue-600">
                    {authenticateReducer?.user?.fullname}
                  </p>
              </div>
            </li>
           
            {user?.role === roles.ADMIN && (
              <>
                <li className="w-full">
                  <Link
                    to="/users"
                    className={`flex items-center p-2 text-base justify-between font-normal ${
                      location.pathname === "/users"
                        ? "bg-gray-700 dark:bg-gray-900"
                        : "bg-inherit"
                    } rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <div className="flex items-center">
                      <UserIcon className="text-gray-500 w-5 h-5" />
                      <span className="hidden md:inline-block ml-3">Users</span>
                    </div>
                  </Link>
                </li>
              </>
            )}
            <li className="w-full">
              <div
                onClick={handleLogout}
                className="flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogoutIcon className="text-gray-500 w-5 h-5" />
                <span className="hidden md:inline-block ml-3">Logout</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
      <Modal open={open} setOpen={setOpen}>
        <Profile close={() => setOpen(!open)} userId={userId} />
        {/* <EditUserPage close={() => setOpen(!open)} userId={userId} /> */}
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
    subRouterReducer: state.subRouterReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doLogout: (refreshToken) => dispatch(logout({ refreshToken })),
    getAllDepartment: (token, data) => dispatch(subRouterUpdate(token, data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
