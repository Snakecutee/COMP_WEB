import { authenticateConstant } from "../../constants";

const {LOGIN_SUCCESS, LOUGOUT_SUCCESS, GET_NEW_TOKEN_SUCCESS} = authenticateConstant;

const initialState = {
  isAuthenticated: false,
  user: {},
  token: "",
  refreshToken: ""
};

const authenticateReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {...state, ...action.payload};
        case LOUGOUT_SUCCESS:
            return {...state, ...initialState};
        case GET_NEW_TOKEN_SUCCESS:
            return {...state, ...action.payload}; 
        default:
            return state;
    }
}

export default authenticateReducer;