import { takeLatest, put, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import { login, refreshToken, logout } from "../../apiServices";
import {
  loginSuccess,
  getNewTokenSuccess,
  logoutSucess,
} from "../actions/authenticateAction";
import { authenticateConstant } from "../../constants";

const { LOGIN, GET_NEW_TOKEN, LOGOUT } = authenticateConstant;

function* postLoginForm(action) {
  const { payload } = action;
  try {
    const { status, data } = yield call(login, payload);
    if (status === 200) {
      yield put(loginSuccess(data));
      return;
    } else if(status === 400) {
      return toast.error(data.message);
    } else {
      return toast.error("Unauthorize");
    }
  } catch (error) {
    console.log(error);
  }
}

function* getNewToken() {
  const { data, status } = yield call(refreshToken);
  if(status === 200) {
    yield put(getNewTokenSuccess(data));
  }
  else {
    yield put(logoutSucess());
  }
}

function* revokeTokenAndLogout(action) {
  const {payload} = action;
  const {status} = yield call(logout, payload);
  if(status === 200) { 
    yield put(logoutSucess());
  }
}

export default function* authenticateSaga() {
  yield takeLatest(LOGIN, postLoginForm);
  yield takeLatest(GET_NEW_TOKEN, getNewToken);
  yield takeLatest(LOGOUT, revokeTokenAndLogout);
}
