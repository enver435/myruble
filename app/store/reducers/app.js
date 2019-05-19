// import action type constants
import {
    SET_LOCALE
} from '../../constants/actions/app';

// init state
const INITIAL_STATE = {
    locale: 'en'
};

export default function appReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_LOCALE:
            return {
                ...state,
                locale: action.payload
            }
        default:
            return state;
    }
}