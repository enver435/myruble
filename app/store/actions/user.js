import { AsyncStorage } from 'react-native';
import Axios from 'axios';

// import action type constants
import {
    USER_GET,
    USER_SIGN_IN,
    USER_SIGN_UP,
    USER_LOGOUT,
} from '../../constants/actions/user';

// import api constants
import { API_URL, API_SIGN_IN, API_SIGN_UP } from '../../constants/api';

// set response
const setResponse = (response) => {
    return responseData = {
        status: response.status ? response.status : false,
        message: response.message ? response.message : null,
        data: response.data ? response.data : null
    };
}

export const get = () => async dispatch => {
    try {
        // get phone storage user data
        const data = await AsyncStorage.getItem('userData');
        // dispatch action
        dispatch({ type: USER_GET, payload: JSON.parse(data) });
        // return response
        return setResponse({ status: true, data: JSON.parse(data) });
    }
    catch (err) {
        // return response
        return setResponse({ status: true, message: err.message });
    }
}

export const signIn = (data) => async dispatch => {
    try {
        const response = await Axios.post(API_URL + API_SIGN_IN, data);
        if(response.data.status) {
            // set phone storage user data
            await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
            // dispatch action
            dispatch({ type: USER_SIGN_IN, payload: response.data.data });
        }
        // return response
        return setResponse(response.data);
    }
    catch (err) {
        // return response
        return setResponse({ status: false, message: err.message });
    }
}

export const signUp = (data) => async dispatch => {
    try {
        const response = await Axios.post(API_URL + API_SIGN_UP, data);
        if(response.data.status) {
            // set phone storage user data
            await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
            // dispatch action
            dispatch({ type: USER_SIGN_UP, payload: response.data.data });
        }
        // return response
        return setResponse(response.data);
    }
    catch (err) {
        // return response
        return setResponse({ status: false, message: err.message });
    }
}

export const logout = () => async dispatch => {       
    try {
        // remove phone storage user data
        await AsyncStorage.removeItem('userData');
        // dispatch action
        dispatch({ type: USER_LOGOUT });
        // return response
        return setResponse({ status: true });
    }
    catch (err) {
        // return response
        return setResponse({ status: false, message: err.message });
    }
}
