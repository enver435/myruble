import React from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    ActivityIndicator
} from 'react-native';

const Loading = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#474747" />
        <StatusBar barStyle="default" />
    </View>
);

// component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa'
    }
});

export default Loading;