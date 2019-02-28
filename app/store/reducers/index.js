import { combineReducers } from 'redux';

// import reducers
import userReducer from './user';

// combine reducers
const rootReducer = combineReducers({
    user: userReducer
});

export default rootReducer;