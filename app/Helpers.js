import {
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import Axios from 'axios';
import firebase from 'react-native-firebase';

export const IsJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const getStorage = async (key) => {
    try {
        let data = await AsyncStorage.getItem(key);
        if (data !== null) {
            if (IsJsonString(data)) {
                data = JSON.parse(data);
            }
            return data;
        }
        return false;
    } catch (err) {
        showToast(err.message);
    }
}

export const setStorage = async (key, value) => {
    try {
        value = (typeof value == 'object' ? JSON.stringify(value) : value);
        await AsyncStorage.setItem(key, value);
    } catch (err) {
        showToast(err.message);
    }
}

export const removeStorage = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (err) {
        showToast(err.message);
    }
}

export const POST = async (url, data = {}) => {
    try {
        return await Axios.post(url, data);
    } catch (err) {
        showToast(err.message);
    }
}

export const GET = async (url, params = {}) => {
    try {
        return await Axios.get(url, {
            params
        });
    } catch (err) {
        showToast(err.message);
    }
}

export const getFirebaseToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
        return fcmToken;
    }
    return false;
}

export const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        50,
    );
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export const setResponse = (response) => {
    return {
        status: response.status ? response.status : false,
        message: response.message ? response.message : null,
        data: response.data ? response.data : null
    };
}