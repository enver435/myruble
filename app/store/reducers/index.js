import {
    combineReducers
} from 'redux';

// import reducers
import userReducer from './user';
import gameReducer from './game';

// combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    game: gameReducer
});

export default rootReducer;