import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#474747" />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Loading;