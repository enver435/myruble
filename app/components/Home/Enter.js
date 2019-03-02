import React, { Component } from 'react';
import { View, TextInput, TouchableHighlight, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Enter extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            input: ''
        };
    }

    onClickSend = () => {
        // console.warn(this.state.input);
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid="#474747"
                    keyboardType="numeric"
                    returnKeyType="send"
                    value={this.state.input}
                    onChangeText={(val) => this.setState({ input: val })}
                    onSubmitEditing={this.onClickSend}
                    blurOnSubmit={false}
                />
                <TouchableHighlight
                    onPress={this.onClickSend}
                    underlayColor="transparent"
                >
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

export default Enter;
