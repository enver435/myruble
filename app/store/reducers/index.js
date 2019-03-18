import { combineReducers } from 'redux';

// import reducers
import userReducer from './user';
import withdrawsReducer from './withdraws';
import gameReducer from './game';

// combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    withdraws: withdrawsReducer,
    game: gameReducer
});

export default rootReducer;