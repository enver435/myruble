// import helpers
import {
    POST,
    GET,
    setResponse,
    _getLevelData,
    getMath
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
    API_GAME_LEVELS,
    API_INSERT_GAME
} from '../../constants/api';

export const getLevels = () => async dispatch => {
    try {
        const response = await GET(API_GAME_LEVELS);
        if (response.status) {
            // dispatch action
            dispatch({
                type: GAME_LEVELS,
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

export const getLevelData = (level) => async dispatch => {
    const {
        currentLevel
    } = _getLevelData(level);
    // dispatch action
    dispatch({
        type: GAME_LEVEL_DATA,
        payload: currentLevel
    });
}

export const startGame = () => async dispatch => {
    const payload = getMath();

    // dispatch action
    dispatch({
        type: GAME_START,
        payload
    });
}

export const nextQuestion = () => async dispatch => {
    const payload = getMath();

    // dispatch action
    dispatch({
        type: GAME_NEXT_QUESTION,
        payload
    });
}

export const checkAnswer = (answer) => async dispatch => {
    // dispatch action
    dispatch({
        type: GAME_CHECK_ANSWER,
        payload: {
            answer
        }
    });
}

export const resultGame = (data) => async dispatch => {
    try {
        const response = await POST(API_INSERT_GAME, data);
        if (response.status) {
            // dispatch action
            dispatch({
                type: GAME_RESULT
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

export const setCurrentTime = () => async dispatch => {
    // dispatch action
    dispatch({
        type: GAME_CURRENT_TIME
    });
}