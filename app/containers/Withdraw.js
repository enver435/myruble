import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import screen
import Withdraw from '../screens/Withdraw';

// import actions
import * as userActions from '../store/actions/user';

// map state to props
const mapStateToProps = (state, ownProps) => {
    return {
        userState: state.user
    }
}

// map dispatch to props
function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);