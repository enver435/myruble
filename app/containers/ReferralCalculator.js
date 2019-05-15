import {
    connect
} from 'react-redux';

// import screen
import ReferralCalculator from '../screens/ReferralCalculator';

// map state to props
const mapStateToProps = (state, ownProps) => {
    return {
        gameState: state.game
    }
}

export default connect(mapStateToProps, null)(ReferralCalculator);