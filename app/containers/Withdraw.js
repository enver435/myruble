import { connect } from 'react-redux';

// import screen
import Withdraw from '../screens/Withdraw';

// map state to props
const mapStateToProps = (state, ownProps) => {
    return {
        userState: state.user
    }
}

export default connect(mapStateToProps, null)(Withdraw);