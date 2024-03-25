import { Navigate } from "react-router-dom";
import {connect} from 'react-redux'

const UnauthorizeRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/" /> : <>{children}</>;
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authenticateReducer.isAuthenticated,
  };
};

export default connect(mapStateToProps)(UnauthorizeRoute);
