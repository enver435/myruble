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
            const response = await GET(API_USER_INFO, {
                full: true,
                id: userData.id
            });
            if (response.status) {
                // set phone storage user data
                await setStorage('userData', response.data);
                
                // dispatch action
                dispatch({
                    type: USER_GET,
                    payload: response.data
                });
            }
            // return response
            return response;
        }
        // set auth error
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
        const response = await POST(API_SIGN_IN, data);
        if (response.status) {
            // set phone storage user data
            await setStorage('userData', response.data);

            // dispatch action
            dispatch({
                type: USER_SIGN_IN,
                payload: response.data
            });
        }
        // return response
        return response;
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
        const response = await POST(API_SIGN_UP, data);
        if (response.status) {
            // set phone storage user data
            await setStorage('userData', response.data);

            // dispatch action
            dispatch({
                type: USER_SIGN_UP,
                payload: response.data
            });
        }
        // return response
        return response;
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

export const update = (data, req = true) => async dispatch => {
    try {
        // get phone storage user data
        const userData = await getStorage('userData');
        if (userData) {
            if (req) {
                // post request update user data
                const response = await POST(API_USER_UPDATE, {
                    id: userData.id,
                    data: {
                        ...data
                    }
                });
                if (response.status) {
                    // set phone storage user data
                    await setStorage('userData', response.data);

                    // dispatch action
                    dispatch({
                        type: USER_UPDATE,
                        payload: response.data
                    });
                }
                // return response
                return response;
            } else {
                // set phone storage user data
                await setStorage('userData', data);

                // dispatch action
                dispatch({
                    type: USER_UPDATE,
                    payload: data
                });
                
                // return response
                return setResponse({
                    status: true,
                    data
                });
            }
        }
        // set auth error
        throw new Error('Error: Not auth!');
    } catch (err) {
        // return response
        return setResponse({
            status: false,
            message: err.message
        });
    }
}