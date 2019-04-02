const API_URL_DEV = "http://192.168.1.109/myruble/api";
const API_URL_PROD = "http://myruble.com/api";

/**
 * API Url
 */
export const API_URL = API_URL_DEV;

/**
 * AUTH Routes
 */
export const API_SIGN_IN = "/auth/signin";
export const API_SIGN_UP = "/auth/signup";

/**
 * USER Routes
 */
export const API_USER_INFO = "/user/info";
export const API_USER_UPDATE = "/user/update";

/**
 * GAME Routes
 */
export const API_GAME_LEVELS = "/game/levels";
export const API_INSERT_GAME = "/game/insert";

/**
 * WITHDRAW Routes
 */
export const API_GET_WITHDRAWS = "/withdraw";
export const API_INSERT_WITHDRAW = "/withdraw/insert"
export const API_GET_WITHDRAW_METHODS = "/withdraw/methods";

/**
 * REFERRAL Routes
 */
export const API_GET_REFERRALS = "/referral";
export const API_INSERT_REFERRAL = "/referral/insert"