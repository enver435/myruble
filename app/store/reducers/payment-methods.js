// import payment method action type constants
import {
    GET_PAYMENT_METHODS
} from '../../constants/actions/payment-methods';

// init state
const INITIAL_STATE = {};

export default function paymentMethodsReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_PAYMENT_METHODS:
            return action.payload;
        default:
            return state;
    }
}