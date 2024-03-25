import DashBoardLayout from '../../layout/DashboardLayout';
import { Navigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { roles } from "../../constants/role";
import ApplicationBaseLayout from "../../layout/ApplicationBaseLayout";


const PrivateRoute = ({ isAuthenticated, children, allowRoles = roles.ALL, user }) => {
  const location = useLocation();
  return isAuthenticated ? (
    allowRoles?.includes(user?.role) ? (
      user.role !== roles.STAFF ? (
        <DashBoardLayout>{children}</DashBoardLayout>
      ) : (
        <ApplicationBaseLayout>{children}</ApplicationBaseLayout>
      )
    ) : (
      <Navigate to="/error" state={{ from: location }} />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authenticateReducer.isAuthenticated,
    user: state.authenticateReducer.user,
  };
};


export default connect(mapStateToProps)(PrivateRoute);
