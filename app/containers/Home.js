import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import screen
import Home from '../screens/Home';

// import actions
import * as userActions from '../store/actions/user';
import * as gameActions from '../store/actions/game';

// map state to props
const mapStateToProps = (state, ownProps) => {
    return {
        userState: state.user,
        gameState: state.game
    }
}

// map dispatch to props
function mapDispatchToProps(dispatch, ownProps) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        gameActions: bindActionCreators(gameActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);