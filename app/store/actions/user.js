// import helpers
import {
    POST,
    GET,
    setStorage,
    getStorage,
    removeStorage,
    setResponse
} from '../../Helpers';

// import action type constants
import {
    USER_GET,
    USER_SIGN_IN,
    USER_SIGN_UP,
    USER_LOGOUT,
    USER_UPDATE
} from '../../constants/actions/user';

// import api constants
import {
    API_URL,
    API_USER_INFO,
    API_USER_UPDATE,
    API_SIGN_IN,
    API_SIGN_UP
} from '../../constants/api';

export const get = () => async dispatch => {
    try {
        // get phone storage user data
        const userData = await getStorage('userData');
        if (userData) {
            // request and get user data
            const response = await GET(API_URL + API_USER_INFO, {
                full: true,
                id: userData.id
            });

            // if status true
            if (response.data.status) {
                // set phone storage user data
                await setStorage('userData', response.data.data);

                // dispatch action
                dispatch({
                    type: USER_GET,
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

export const signIn = (data) => async dispatch => {
    try {
        const response = await POST(API_URL + API_SIGN_IN, data);

        if (response.data.status) {
            // set phone storage user data
            await setStorage('userData', response.data.data);

            // dispatch action
            dispatch({
                type: USER_SIGN_IN,
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

export const signUp = (data) => async dispatch => {
    try {
        const response = await POST(API_URL + API_SIGN_UP, data);

        if (response.data.status) {
            // set phone storage user data
            await setStorage('userData', response.data.data);

            // dispatch action
            dispatch({
                type: USER_SIGN_UP,
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

export const logout = () => async dispatch => {
    try {
        // remove phone storage user data
        await removeStorage('userData');

        // dispatch action
        dispatch({
            type: USER_LOGOUT
        });

        // return response
        return setResponse({
            status: true
        });
    } catch (err) {
        // return response
        return setResponse({
            status: false,
            message: err.message
        });
    }
}

export const update = (data) => async dispatch => {
    try {
        // get phone storage user data
        const userData = await getStorage('userData');

        if (userData) {
            // post request update user data
            const response = await POST(API_URL + API_USER_UPDATE, {
                id: userData.id,
                data: {
                    ...data
                }
            });

            if (response.data.status) {
                // set phone storage user data
                await setStorage('userData', response.data.data);

                // dispatch action
                dispatch({
                    type: USER_UPDATE,
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