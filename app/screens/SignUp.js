import React, { Component } from 'react';
import { View, Text } from 'react-native';

class SignUp extends Component {
    static navigationOptions = {
        title: 'Регистрация'
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View >
                <Text> SignUp Screen </Text>
            </View>
        );
    }
}

export default SignUp;