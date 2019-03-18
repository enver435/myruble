// import helpers
import {
    GET,
    setResponse
} from '../../Helpers';

// import payment method action type constants
import {
    GET_PAYMENT_METHODS
} from '../../constants/actions/payment-methods';

// import api constants
import {
    API_URL,
    API_GET_PAYMENT_METHODS
} from '../../constants/api';

export const get = () => async dispatch => {
    try {
        const response = await GET(API_URL + API_GET_PAYMENT_METHODS);
        if (response.data.status) {
            // dispatch action
            dispatch({
                type: GET_PAYMENT_METHODS,
                payload: response.data.data
            });
        }
        // return response
        return setResponse(response.data);
    } catch (err) {
        // return response
        return setResponse({
            status: false,
            message: err.message
        });
    }
}