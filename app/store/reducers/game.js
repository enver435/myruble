import {
    GAME_DEFAULT,
    GAME_START,
    GAME_STOP,
    GAME_NEXT,
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
    const firstNumber = getRandomInt(0, 100);
    const secondNumber = getRandomInt(0, 100);

    switch (action.type) {
        case GAME_DEFAULT:
            return {
                defaultData: action.payload,
                data: state.data
            };
        case GAME_START:
            return {
                defaultData: state.defaultData,
                data: {
                    ...state.data,
                    status: true,
                    firstNumber,
                    secondNumber,
                    correctAnswer: firstNumber + secondNumber
                }
            };
        case GAME_STOP:
            return {
                defaultData: state.defaultData,
                data: INITIAL_STATE.data
            };
        case GAME_NEXT:
            return {
                defaultData: state.defaultData,
                data: {
                    ...state.data,
                    taskSuccess: action.payload.correct ? state.taskSuccess + 1 : state.taskSuccess,
                    taskFail: !action.payload.correct ? state.taskFail + 1 : state.taskFail,
                    firstNumber,
                    secondNumber,
                    correctAnswer: firstNumber + secondNumber
                }
            };
        case GAME_CURRENT_TIME:
            return {
                defaultData: state.defaultData,
                data: {
                    ...state.data,
                    currentTime: action.payload
                }
            };
        case GAME_RESULTS:
        default:
            return state;
    }
}