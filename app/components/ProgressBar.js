import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[ styles.inner, { width: this.props.percent + '%' }]}></View>
            </View>
        );
    }
}

// component prop types
ProgressBar.propTypes = {
    percent: PropTypes.number
};

// component default props
ProgressBar.defaultProps = {
    percent: 0
};

// component styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#c2c0c0',
        width: '100%',
        height: 20,
        borderRadius: 5,
        overflow: 'hidden'
    },
    inner: {
        backgroundColor: '#474747',
        height: 20
    }
});

export default ProgressBar;