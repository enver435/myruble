// import withdraws action type constants
import {
    GET_ALL_WITHDRAW,
    GET_USER_WITHDRAW,
    INSERT_WITHDRAW,
    RESET_WITHDRAW
} from '../../constants/actions/withdraws';

// init state
const INITIAL_STATE = {
    all: [],
    user: []
};

export default function withdrawsReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_ALL_WITHDRAW:
            return {
                all: [ ...state.all, ...action.payload ],
                user: [ ...state.user ]
            }
        case GET_USER_WITHDRAW:
            return {
                all: [ ...state.all ],
                user: [ ...state.user, ...action.payload ]
            }
        case INSERT_WITHDRAW:
            return {
                all: [ ...action.payload, ...state.all ],
                user: [ ...action.payload, ...state.user ]
            }
        case RESET_WITHDRAW:
            return INITIAL_STATE;
        default:
            return state;
    }
}