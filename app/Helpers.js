import {
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import Axios from 'axios';
import firebase from 'react-native-firebase';

// import store
import store from './store';

// import api constants
import {
    API_URL_DEV,
    API_URL_PROD
} from './constants/api';

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

export const POST = async (url = '', data = {}) => {
    try {
        const response = await Axios.post(url, data, {
            baseURL: __DEV__ ? API_URL_DEV : API_URL_PROD,
            auth: {
                username: 'myrubleapi',
                password: 'XcG68R`9bqzHgCmp'
            }
        });
        return setResponse(response.data);
    } catch (err) {
        return setResponse({
            status: false,
            message: err.message
        });
    }
}

export const GET = async (url = '', params = {}) => {
    try {
        const response = await Axios.get(url, {
            params,
            baseURL: __DEV__ ? API_URL_DEV : API_URL_PROD,
            auth: {
                username: 'myrubleapi',
                password: 'XcG68R`9bqzHgCmp'
            }
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

export const getRandomInt = (min, max, ignoreNums = []) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const calc = Math.floor(Math.random() * (max - min + 1)) + min;
    if (ignoreNums.length > 0 && ignoreNums.indexOf(calc) !== -1) {
        return getRandomInt(min, max, ignoreNums);
    }
    return calc;
}

export const getUniqId = async (len) => {
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

export const strPadBoth = (str, length, pad = '0') => {
    str = str.toString();
    var spaces = length - str.length;
    var padLeft = spaces / 2 + str.length;
    return str.padStart(padLeft, pad).padEnd(length, pad);
}

export const strMasked = (str, length, pad = '*') => {
    str = str.toString();
    return str.slice(0, str.length - length).padEnd(str.length, pad)
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

export const getMath = () => {
    // get level data
    const levelData = store.getState().game.defaultData;

    /**
     * Nums Objects
     */
    const nums = {
        numOne: levelData.math_num_one == 1 ? true : false,
        numTwo: levelData.math_num_two == 1 ? true : false,
        numThree: levelData.math_num_three == 1 ? true : false
    };

    /**
     * Operators Objects
     */
    const operators = {
        positive: levelData.math_positive == 1 ? true : false,
        negative: levelData.math_negative == 1 ? true : false,
        multiplication: levelData.math_multiplication == 1 ? true : false,
        division: levelData.math_division == 1 ? true : false
    };

    /**
     * Get Random Number
     * 1 => numOne
     * 2 => numTwo,
     * 3 => numThree
     */
    let randNum = false;
    // if more than one
    const numFilter = Object.values(nums).filter((item => {
        return item === true
    }))
    if (numFilter.length > 1) {
        let ignoreNums = [];
        Object.entries(nums).map((val, index) => {
            const indx = index + 1;
            const isActive = val[1];
            if (!isActive) {
                ignoreNums.push(indx);
            }
        });
        randNum = getRandomInt(1, 3, ignoreNums);
    }

    let min = 0;
    let max = 0;
    if ((nums.numOne && !randNum) || randNum == 1) {
        min = 0;
        max = 9;
    } else if ((nums.numTwo && !randNum) || randNum == 2) {
        min = 10;
        max = 99;
    } else if ((nums.numThree && !randNum) || randNum == 3) {
        min = 100;
        max = 999;
    }

    /**
     * Get First and Second Number
     */
    const firstNumber = getRandomInt(min, max);
    const secondNumber = getRandomInt(min, max);

    /**
     * Get Operator
     * 1 => positive (+)
     * 2 => negative (-)
     * 3 => multiplication (*)
     * 4 => division (/)
     */
    let randOperator = false;
    // if more than one
    const operatorFilter = Object.values(operators).filter((item => {
        return item === true
    }));
    if (operatorFilter.length > 1) {
        let ignoreNums = [];
        Object.entries(operators).map((val, index) => {
            const indx = index + 1;
            const isActive = val[1];
            if (!isActive) {
                ignoreNums.push(indx);
            }
        });
        randOperator = getRandomInt(1, 4, ignoreNums);
    }

    /**
     * Calculate
     */
    let math = 0;
    let operator = 1;
    if ((operators.positive && !randOperator) || randOperator == 1) {
        math = firstNumber + secondNumber;
        operator = 1;
    } else if ((operators.negative && !randOperator) || randOperator == 2) {
        math = firstNumber - secondNumber;
        operator = 2;
    } else if ((operators.multiplication && !randOperator) || randOperator == 3) {
        math = firstNumber * secondNumber;
        operator = 3;
    } else if ((operators.division && !randOperator) || randOperator == 4) {
        math = firstNumber / secondNumber;
        operator = 4;
    }

    /**
     * Return Result
     */
    if (math >= 0 && Math.floor(math) == math) {
        return {
            firstNumber,
            secondNumber,
            operator,
            correctAnswer: math
        };
    }
    return getMath(nums, operators);
}