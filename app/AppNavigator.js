import { createStackNavigator, createAppContainer } from 'react-navigation';

// import containers
import Home from './containers/Home';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';

const AppNavigator = createStackNavigator({
    Home,
    SignIn,
    SignUp
});

export default createAppContainer(AppNavigator);