import Axios from 'axios';

// import action type constants
import {
    GAME_DEFAULT,
    GAME_START,
    GAME_STOP,
    GAME_NEXT,
    GAME_CURRENT_TIME,
    GAME_RESULTS
} from '../../constants/actions/game';

// import api constants
import { 
    API_URL,
    API_GAME_DEFAULT
} from '../../constants/api';

// set response
const setResponse = (response) => {
    return responseData = {
        status: response.status ? response.status : false,
        message: response.message ? response.message : null,
        data: response.data ? response.data : null
    };
}

export const getDefault = () => async dispatch => {
    try {
        const response = await Axios.post(API_URL + API_GAME_DEFAULT);
        if(response.data.status) {
            // dispatch action
            dispatch({ type: GAME_DEFAULT, payload: response.data.data });
        }
        // return response
        return setResponse(response.data);
    }
    catch (err) {
        // return response
        return setResponse({ status: false, message: err.message });
    }
}

export const startGame = () => async dispatch => {
    dispatch({ type: GAME_START });
}

export const stopGame = () => async dispatch => {
    dispatch({ type: GAME_STOP });
}

export const nextGame = (correct) => async dispatch => {
    dispatch({
        type: GAME_NEXT,
        payload: { correct }
    });
}

export const resultsGame = () => async dispatch => {
    dispatch({ type: GAME_RESULTS });
}

export const setCurrentTime = (currentTime) => async dispatch => {
    dispatch({ type: GAME_CURRENT_TIME, payload: currentTime });
}
