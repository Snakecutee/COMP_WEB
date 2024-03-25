import { authenticateConstant } from "../../constants"
const {LOGIN, LOGIN_SUCCESS, LOUGOUT_SUCCESS, GET_NEW_TOKEN_SUCCESS, GET_NEW_TOKEN, LOGOUT} = authenticateConstant;

export const login = (payload) => {
    return {type: LOGIN, payload }
}

export const logout = (payload) => {
    return {type: LOGOUT, payload}
}

export const loginSuccess = (payload) => {
    return {type: LOGIN_SUCCESS, payload}
}

export const logoutSucess = () => {
    return {type: LOUGOUT_SUCCESS}
}

export const getNewToken = () => {
    return {type: GET_NEW_TOKEN}
}

export const getNewTokenSuccess = (payload) => {
    return {type: GET_NEW_TOKEN_SUCCESS, payload}
}