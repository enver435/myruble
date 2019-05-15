import {
    createStackNavigator,
    createAppContainer
} from 'react-navigation';

// import containers
import Main from './containers/Main';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import Withdraw from './containers/Withdraw';
import MyReferrals from './containers/MyReferrals';
import InviteReferral from './containers/InviteReferral';
import ReferralCalculator from './containers/ReferralCalculator';
import PrizeReferral from './containers/PrizeReferral';

const AppNavigator = createStackNavigator({
    Main,
    SignIn,
    SignUp,
    Withdraw,
    MyReferrals,
    InviteReferral,
    ReferralCalculator,
    PrizeReferral
}, {
    defaultNavigationOptions: {
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 17
        }
    },
    transitionConfig: () => ({
        screenInterpolator: () => null
    }),
});

export default createAppContainer(AppNavigator);