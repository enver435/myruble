// import user action type constants
import {
    USER_GET,
    USER_SIGN_IN,
    USER_SIGN_UP,
    USER_LOGOUT,
} from '../../constants/actions/user';

// init state
const INITIAL_STATE = {
    isAuth: false,
    data: {}
};

export default function userReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case USER_GET:
        case USER_SIGN_IN:
        case USER_SIGN_UP:
            return Object.assign({}, state, {
                isAuth: !action.payload ? false : true,
                data: action.payload
            });
        case USER_LOGOUT:
            return Object.assign({}, state, INITIAL_STATE);
        default:
            return state;
    }
}