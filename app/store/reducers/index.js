import {
    combineReducers
} from 'redux';

// import reducers
import appReducer from './app';
import userReducer from './user';
import gameReducer from './game';

// combine reducers
const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    game: gameReducer
});

export default rootReducer;