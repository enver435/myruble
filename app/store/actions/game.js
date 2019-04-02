// import helpers
import {
    POST,
    GET,
    setResponse,
    _getLevelData
} from '../../Helpers';

// import action type constants
import {
    GAME_LEVELS,
    GAME_LEVEL_DATA,
    GAME_START,
    GAME_NEXT_QUESTION,
    GAME_CHECK_ANSWER,
    GAME_CURRENT_TIME,
    GAME_RESULT
} from '../../constants/actions/game';

// import api constants
import {
    API_URL,
    API_GAME_LEVELS,
    API_INSERT_GAME
} from '../../constants/api';

export const getLevels = () => async dispatch => {
    try {
        const response = await GET(API_URL + API_GAME_LEVELS);
        if (response.data.status) {
            // dispatch action
            dispatch({
                type: GAME_LEVELS,
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

export const getLevelData = (levelXP) => async dispatch => {
    const {
        currentLevel
    } = _getLevelData(levelXP);
    
    dispatch({
        type: GAME_LEVEL_DATA,
        payload: currentLevel
    });
}

export const startGame = () => async dispatch => {
    dispatch({
        type: GAME_START
    });
}

export const nextQuestion = () => async dispatch => {
    dispatch({
        type: GAME_NEXT_QUESTION
    });
}

export const checkAnswer = (answer) => async dispatch => {
    dispatch({
        type: GAME_CHECK_ANSWER,
        payload: {
            answer
        }
    });
}

export const resultGame = (data) => async dispatch => {
    try {
        const response = await POST(API_URL + API_INSERT_GAME, data);
        if (response.data.status) {
            // dispatch action
            dispatch({
                type: GAME_RESULT
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

export const setCurrentTime = () => async dispatch => {
    dispatch({
        type: GAME_CURRENT_TIME
    });
}