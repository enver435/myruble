import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Calc extends Component {
    constructor(props) {
        super(props);
    }

    fmtMSS = (s) => {
        return (s - (s %= 60)) / 60 + ( 9 < s ? ':' : ':0') + s;
    }

    render() {
        const { status, firstNumber, secondNumber, currentTime } = this.props.gameState.data;
        const { time } = this.props.gameState.defaultData;
        const { heart } = this.props.userState.data;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.heart}>
                        <Text style={styles.heartText}>{heart}</Text>
                        <Icon name="favorite-border" size={25} color="#474747" style={styles.heartIcon} />
                    </View>
                    <View style={styles.timer}>
                        <Icon name="timer" size={25} color="#474747" style={styles.timerIcon} />
                        <Text style={styles.timerText}>{this.fmtMSS(time - currentTime)}</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.contentText}>{status ? firstNumber + ' + ' + secondNumber : 'Tap to Play'}</Text>
                </View>
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        padding: 10,
        height: 125
    },
    content: {
        flex: 1
    },
    contentText: {
        fontSize: 40,
        textAlign: 'center',
        color: '#474747'
    },
    header: {
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    heart: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    heartText: {
        fontSize: 18,
        color: '#474747'
    },
    heartIcon: {
        marginLeft: 5
    },
    timer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    timerText: {
        fontSize: 18,
        color: '#474747',
    },
    timerIcon: {
        marginRight: 5
    }
});

// component prop types
Calc.propTypes = {
    userState: PropTypes.object.isRequired,
    gameState: PropTypes.object.isRequired
};

export default Calc;
