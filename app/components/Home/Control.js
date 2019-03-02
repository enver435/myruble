import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Control extends Component {
	constructor(props) {
        super(props);
        // init state
        this.state = {
            control: props.gameStatus ? 'stop' : 'play'
        };
    }
    
    onPressControl = () => {
        if(this.state.control == 'play') {
            this.props.gameActions.startGame();
            this.setState({ control: 'stop' });
        } else {
            // this.props.gameActions.stopGame();
            this.setState({ control: 'play' });
        }
    }

	render() {
		return (
			<View style={styles.container}>
                <TouchableHighlight 
                    underlayColor="transparent"
                    onPress={() => this.onPressControl()}>       
                        <Icon name={this.state.control + '-circle-outline'} size={60} color="#474747" />
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

export default Control;
