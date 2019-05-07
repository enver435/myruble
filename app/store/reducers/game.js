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

// init state
const INITIAL_STATE = {
    defaultData: {},
    levels: [],
    data: {
        status: false,
        currentTime: 0,
        taskSuccess: 0,
        taskFail: 0,
        firstNumber: 0,
        secondNumber: 0,
        operator: 1,
        correctAnswer: 0
    }
};

export default function gameReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GAME_LEVELS:
            return {
                ...state,
                levels: action.payload
            };
        case GAME_LEVEL_DATA:
            return {
                ...state,
                defaultData: action.payload
            };
        case GAME_START:
            return {
                ...state,
                data: {
                    ...INITIAL_STATE.data,
                    status: true,
                    ...action.payload
                }
            };
        case GAME_CHECK_ANSWER:
            const correct = action.payload.answer == state.data.correctAnswer ? true : false;
            const taskSuccess = correct ? state.data.taskSuccess + 1 : state.data.taskSuccess;
            const taskFail = !correct ? state.data.taskFail + 1 : state.data.taskFail;

            return {
                ...state,
                data: {
                    ...state.data,
                    taskSuccess,
                    taskFail
                }
            };
        case GAME_NEXT_QUESTION:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.payload
                }
            };
        case GAME_CURRENT_TIME:
            return {
                ...state,
                data: {
                    ...state.data,
                    currentTime: state.data.currentTime + 1
                }
            };
        case GAME_RESULT:
            return {
                ...state,
                data: {
                    ...state.data,
                    status: false,
                    currentTime: 0
                }
            }
        default:
            return state;
    }
}