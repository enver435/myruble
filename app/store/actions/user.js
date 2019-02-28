import { AsyncStorage } from 'react-native';
import {
    USER_LOGIN,
    USER_LOGOUT,
    USER_GET
} from '../../constants/actions/user';

export const getUser = () => async dispatch => {
    try {
        const data = await AsyncStorage.getItem('userData');
        return dispatch({
            type: USER_GET,
            payload: JSON.parse(data)
        });
    }
    catch (err) {
        return dispatch({ err });
    }
}

export const loginUser = (data) => async dispatch => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        return dispatch({
            type: USER_LOGIN,
            payload: data
        });
    }
    catch (err) {
        return dispatch({ err });
    }
}

export const logoutUser = () => async dispatch => {       
    try {
        await AsyncStorage.removeItem('userData');
        return dispatch({
            type: USER_LOGOUT
        });
    }
    catch (err) {
        return dispatch({ err });
    }
}
