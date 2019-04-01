import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import {
    withNavigation
} from 'react-navigation';

// import screen
import SignIn from '../screens/SignIn';

// import actions
import * as userActions from '../store/actions/user';

// map dispatch to props
function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(withNavigation(SignIn));