// import action type constants
import {
    GAME_DEFAULT,
    GAME_START,
    GAME_NEXT_QUESTION,
    GAME_CHECK_ANSWER,
    GAME_CURRENT_TIME,
    GAME_RESULTS
} from '../../constants/actions/game';

// init state
const INITIAL_STATE = {
    defaultData: {},
    data: {
        status: false,
        currentTime: 0,
        taskSuccess: 0,
        taskFail: 0,
        firstNumber: 0,
        secondNumber: 0,
        correctAnswer: 0
    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export default function gameReducer(state = INITIAL_STATE, action) {
    const firstNumber  = getRandomInt(0, 100);
    const secondNumber = getRandomInt(0, 100);

    switch (action.type) {
        case GAME_DEFAULT:
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
                    firstNumber,
                    secondNumber,
                    correctAnswer: firstNumber + secondNumber
                }
            };
        case GAME_CHECK_ANSWER:
            const correct     = action.payload.answer == state.data.correctAnswer ? true : false;
            const taskSuccess = correct ? state.data.taskSuccess + 1 : state.data.taskSuccess;
            const taskFail    = !correct ? state.data.taskFail + 1 : state.data.taskFail;

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
                    firstNumber,
                    secondNumber,
                    correctAnswer: firstNumber + secondNumber
                }
            };
        case GAME_CURRENT_TIME:
            return {
                ...state,
                data: {
                    ...state.data,
                    currentTime: state.data.currentTime+1
                }
            };
        case GAME_RESULTS:
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