const authenticatePrefix = "APPLICATION_AUTHENTICATE";
const subRouterPrefix = "APPLICATION_SUB_ROUTER/";

export const authenticateConstant = {
  LOGIN: `${authenticatePrefix}/LOGIN`,
  LOGIN_SUCCESS: `${authenticatePrefix}/LOGIN_SUCCESS`,
  REGISTER: `${authenticatePrefix}/REGISTER_SUCCESS`,
  LOGOUT: `${authenticatePrefix}/LOGOUT`,
  LOUGOUT_SUCCESS: `${authenticatePrefix}/LOUGOUT_SUCCESS`,
  GET_NEW_TOKEN: `${authenticatePrefix}/GET_NEW_TOKEN`,
  GET_NEW_TOKEN_SUCCESS: `${authenticatePrefix}/GET_NEW_TOKEN_SUCCESS`,
};

export const subRouterConstants = {
  SUB_ROUTER: `${subRouterPrefix}SUB_ROUTER`,
  SUB_ROUTER_UPDATE_SUCCESS: `${subRouterPrefix}SUB_ROUTER_UPDATE_SUCCESS`,
};
