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
        this.state = {
            disabled: false
        };
    }

    onPressControl = async (status) => {
        // set state
        this.setState({
            disabled: true
        });

        if (!status) {
            await this.props.startGame();
        } else {
            await this.props.stopGame();
        }

        // set state
        this.setState({
            disabled: false
        });
    }

    render() {
		return (
			<View style={styles.container}>
                <TouchableHighlight 
                    underlayColor="transparent"
                    onPress={this.state.disabled ? null : () => this.onPressControl(this.props.status)}>       
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