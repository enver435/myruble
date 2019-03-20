import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import screen
import Withdraw from '../screens/Withdraw';

// import actions
import * as userActions from '../store/actions/user';
import * as withdrawActions from '../store/actions/withdraws';

// map state to props
const mapStateToProps = (state, ownProps) => {
    return {
        userState: state.user,
        withdrawState: state.withdraws
    }
}

// map dispatch to props
function mapDispatchToProps(dispatch, ownProps) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        withdrawActions: bindActionCreators(withdrawActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);