import {
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import Axios from 'axios';
import firebase from 'react-native-firebase';

// import store
import store from './store';

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
        const response = await Axios.post(url, data);
        return setResponse(response.data);
    } catch (err) {
        return setResponse({
            status: false,
            message: err.message
        });
    }
}

export const GET = async (url, params = {}) => {
    try {
        const response = await Axios.get(url, {
            params
        });
        return setResponse(response.data);
    } catch (err) {
        return setResponse({
            status: false,
            message: err.message
        });
    }
}

export const setResponse = (response) => {
    return {
        status: response.status ? response.status : false,
        message: response.message ? response.message : null,
        data: response.data ? response.data : null
    };
}

export const getFirebaseToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
        return fcmToken;
    }
    return false;
}

export const showToast = (message) => {
    if (message) {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    }
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export const getUniqId = (len) => {
    const timestamp = +new Date;
    const ts = timestamp.toString();
    const parts = ts.split("").reverse();
    let id = '';

    for (let i = 0; i < len; ++i) {
        const index = getRandomInt(0, parts.length - 1);
        id += parts[index];
    }

    return id;
}

export const timeToDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    
    const convert = ("0" + date.getDate()).slice(-2) + '.' +
    ("0" + (date.getMonth() + 1)).slice(-2) + '.' +
    date.getFullYear() + ' ' +
    ("0" + date.getDate()).slice(-2) + ':' + ("0" + date.getMonth()).slice(-2);

    return convert;
}

export const _getLevelData = (level) => {
    const state = store.getState();
    
    const levels = state.game.levels;
    level = levels.filter((item) => {
        return level == item.level;
    });

    return {
        currentLevel: level[0],
        maxLevel: levels[levels.length - 1]
    }
}