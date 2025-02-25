import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';

// import screen
import InviteReferral from '../screens/InviteReferral';

// import actions
import * as userActions from '../store/actions/user';

// map state to props
const mapStateToProps = (state, ownProps) => {
    return {
        userState: state.user
    }
}

// map dispatch to props
function mapDispatchToProps(dispatch, ownProps) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteReferral);