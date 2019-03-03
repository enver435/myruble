import { AsyncStorage } from 'react-native';
import Axios from 'axios';
import { checkUpdatedApp } from '../../Helpers';

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
    API_SIGN_IN,
    API_SIGN_UP
} from '../../constants/api';

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
        let data = JSON.parse(await AsyncStorage.getItem('userData'));

        // if updated application, update user data
        if(await checkUpdatedApp()) {
            const response = await Axios.post(API_URL + API_USER_INFO, {
                id: data.id
            });
            if(response.data.status) {
                // set phone storage user data
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
                // get phone storage user data
                data = JSON.parse(await AsyncStorage.getItem('userData'));
            }
        }
        
        // dispatch action
        dispatch({ type: USER_GET, payload: data });
        // return response
        return setResponse({ status: true, data });
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

export const update = (data) => async dispatch => {
    try {
        const response = await Axios.post(API_URL + API_USER_UPDATE, data);
        if(response.data.status) {
            // set phone storage user data
            await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
            // dispatch action
            dispatch({ type: USER_UPDATE, payload: response.data.data });
        }
        // return response
        return setResponse(response.data);
    }
    catch (err) {
        // return response
        return setResponse({ status: false, message: err.message });
    }
}
