import {
    createStackNavigator,
    createAppContainer
} from 'react-navigation';

// import containers
import Main from './containers/Main';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import Withdraw from './containers/Withdraw';

const AppNavigator = createStackNavigator({
    Main,
    SignIn,
    SignUp,
    Withdraw
}, {
    transitionConfig: () => ({
        screenInterpolator: () => null
    }),
});

export default createAppContainer(AppNavigator);