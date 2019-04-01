import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';

// import screen
import SignUp from '../screens/SignUp';

// import actions
import * as userActions from '../store/actions/user';

// map dispatch to props
function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SignUp);