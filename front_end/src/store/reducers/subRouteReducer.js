import { subRouterConstants } from "../../constants/index";
const initialState = {
  departmentRouters: [],
  categoryRouters: [],
};

const { SUB_ROUTER_UPDATE_SUCCESS } = subRouterConstants;

const subRouterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUB_ROUTER_UPDATE_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default subRouterReducer;
