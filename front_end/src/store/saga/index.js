import {all} from 'redux-saga/effects';

import authenticateSaga from './auth.saga';
import subRouterSaga from './subRouter.saga';
export default function* rootSaga() {
    yield all([
        authenticateSaga(),
        subRouterSaga(),
    ])
}