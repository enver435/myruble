import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-material-ui';

const Offline = ({ checkNetwork }) => (
    <View style={styles.container}>
        <Icon name="access-point-network-off" size={55} color="#474747"></Icon>
        <Button
            onPress={checkNetwork}
            text="Повторное Подключение"
            raised
            style={{ 
                container: {
                    backgroundColor: '#474747',
                },
                text: {
                    color: '#fff'
                }
            }}
        />
    </View>
);

// component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

// component prop types
Offline.propTypes = {
    checkNetwork: PropTypes.func.isRequired
};

export default Offline;