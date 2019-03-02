import {
    GAME_DEFAULT,
    GAME_START,
    GAME_STOP,
    GAME_NEXT
} from '../../constants/actions/game';

// init state
const INITIAL_STATE = {
    defaultData: {},
    data: {
        status: false,
        taskSuccess: 0,
        taskFail: 0,
        firstNumber: 0,
        secondNumber: 0,
        total: 0
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
            return Object.assign({}, state, {
                defaultData: action.payload
            });
        case GAME_START:
            return Object.assign({}, state, {
                data: {
                    status: true,
                    firstNumber,
                    secondNumber,
                    total: firstNumber + secondNumber
                }
            });
        case GAME_STOP:
            return Object.assign({}, state, {
                data: INITIAL_STATE.data
            });
        case GAME_NEXT:
            return Object.assign({}, state, {
                data: {
                    taskSuccess: action.payload.correct ? taskSuccess + 1 : taskSuccess,
                    taskFail: !action.payload.correct ? taskFail + 1 : taskFail,
                    firstNumber,
                    secondNumber,
                    total: firstNumber + secondNumber
                }
            });
        default:
            return state;
    }
}