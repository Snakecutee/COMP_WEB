import {subRouterConstants} from '../../constants/index'


export const subRouterUpdate = () => {
    return {type: subRouterConstants.SUB_ROUTER};
}
export const subRouterUpdateSuccess = (payload) => {
  return { type: subRouterConstants.SUB_ROUTER_UPDATE_SUCCESS, payload };
};