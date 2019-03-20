// import helpers
import {
    POST,
    GET,
    setResponse,
    getStorage
} from '../../Helpers';

// import withdraws action type constants
import {
    GET_ALL_WITHDRAW,
    GET_USER_WITHDRAW,
    INSERT_WITHDRAW,
    RESET_WITHDRAW
} from '../../constants/actions/withdraws';

// import api constants
import {
    API_URL,
    API_GET_WITHDRAW,
    API_INSERT_WITHDRAW
} from '../../constants/api';

export const getAllWithdraws = (offset = 0, limit = 10) => async dispatch => {
    try {
        const response = await GET(API_URL + API_GET_WITHDRAW, {
            offset,
            limit
        });
        if (response.data.status) {
            // dispatch action
            dispatch({
                type: GET_ALL_WITHDRAW,
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

export const getUserWithdraws = (offset = 0, limit = 10) => async dispatch => {
    try {
        // set phone storage user data
        const userData = await getStorage('userData');

        if(userData) {
            // request and get user withdraws
            const response = await GET(API_URL + API_GET_WITHDRAW, {
                user_id: userData.id,
                offset,
                limit
            });
            if (response.data.status) {
                // dispatch action
                dispatch({
                    type: GET_USER_WITHDRAW,
                    payload: response.data.data
                });
            }

            // return response
            return setResponse(response.data);
        }

        // set error
        throw new Error('Error: Not auth!');
    } catch (err) {
        // return response
        return setResponse({
            status: false,
            message: err.message
        });
    }
}

export const insert = (data) => async dispatch => {
    try {
        const response = await POST(API_URL + API_INSERT_WITHDRAW, data);
        if(response.data.status) {
            // dispatch action
            dispatch({
                type: INSERT_WITHDRAW,
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

export const reset = () => async dispatch => {
    dispatch({
        type: RESET_WITHDRAW
    });
}