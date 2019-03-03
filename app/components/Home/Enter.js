import React, { Component } from 'react';
import { View, TextInput, TouchableHighlight, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Enter extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            input: null
        };
    }

    onClickSend = (correctAnswer) => {
        if(correctAnswer === this.state.input) {
            
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid="#474747"
                    keyboardType="numeric"
                    returnKeyType="none"
                    value={this.state.input}
                    onChangeText={(val) => this.setState({ input: val })}
                    onSubmitEditing={this.onClickSend(this.props.correctAnswer)}
                    blurOnSubmit={false}
                />
                <TouchableHighlight
                    onPress={this.onClickSend(this.props.correctAnswer)}
                    underlayColor="transparent">
                    <Icon name="send" size={35} color="#474747" style={styles.btnSend} />
                </TouchableHighlight>
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        padding: 35,
        flexDirection: 'row'
    },
    textInput: {
        fontSize: 17,
        flex: 1
    },
    btnSend: {
        marginTop: 7
    }
});

// component prop types
Enter.propTypes = {
    correctAnswer: PropTypes.number.isRequired,
    sendAnswer: PropTypes.func.isRequired
};

export default Enter;
