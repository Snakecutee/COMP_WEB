import { takeLatest, call, put } from "redux-saga/effects";
import { subRouterConstants } from "../../constants/index";
import { getAllSubRoute } from "../../apiServices/index";
import { subRouterUpdateSuccess } from "../actions/subRouterAction";
const { SUB_ROUTER } = subRouterConstants;

function* updateDepartmentSubRouter() {
  try {
      const { data, status } = yield call(getAllSubRoute);
      status === 200 && (yield put(subRouterUpdateSuccess(data)))
  } catch (error) {
    console.log(error);
  }
}

export default function* subRouterSaga() {
  yield takeLatest(SUB_ROUTER, updateDepartmentSubRouter);
}
