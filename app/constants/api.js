const API_URL_DEV  = "http://192.168.1.109/myruble/api";
const API_URL_PROD = "http://myruble.com/api";

/**
 * API Url
 */
export const API_URL = API_URL_DEV;

/**
 * AUTH URL's
 */
export const API_SIGN_IN = "/auth/signin";
export const API_SIGN_UP = "/auth/signup";

/**
 * USER URL's
 */
export const API_USER_INFO   = "/user/info";
export const API_USER_UPDATE = "/user/update";

/**
 * GAME URL's
 */
export const API_GAME_DEFAULT = "/game";
export const API_INSERT_GAME  = "/game/insert";

/**
 * WITHDRAW URL's
 */
export const API_GET_WITHDRAW         = "/withdraw";
export const API_INSERT_WITHDRAW      = "/withdraw/insert"
export const API_GET_WITHDRAW_METHODS = "/withdraw/methods";