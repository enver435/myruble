import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Control extends Component {
    constructor(props) {
        super(props);
    }

    onPressControl = (status) => {
        if (!status) {
            this.props.startGame()
        } else {
            this.props.stopGame()
        }
    }

    render() {
		return (
			<View style={styles.container}>
                <TouchableHighlight 
                    underlayColor="transparent"
                    onPress={() => this.onPressControl(this.props.status)}>       
                        <Icon name={(!this.props.status ? 'play' : 'stop') + '-circle-outline'} size={60} color="#474747" />
                </TouchableHighlight>
			</View>
		);
	}
}

// component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    }
});

// component prop types
Control.propTypes = {
    status: PropTypes.bool.isRequired,
    startGame: PropTypes.func.isRequired,
    stopGame: PropTypes.func.isRequired
};

export default Control;