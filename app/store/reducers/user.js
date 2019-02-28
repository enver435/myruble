import {
    USER_LOGIN,
    USER_LOGOUT,
    USER_GET
} from '../../constants/actions/user';

// init state
const initState = {
    isAuth: false,
    data: {},
    err: null
};

export default function userReducer(state = initState, action) {
    switch (action.type) {
        case USER_GET:
        case USER_LOGIN:
            return Object.assign({}, state, {
                isAuth: !action.payload ? false : true,
                data: action.payload
            });
        case USER_LOGOUT:
            return Object.assign({}, state, initState);
        default:
            return state;
    }
}