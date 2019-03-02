import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Calc extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            time: props.gameState.defaultData.time
        };
    }

    fmtMSS = (s) => {
        return(s-(s%=60))/60+(9<s?':':':0')+s
    }

    startTimer = () => {
        this.timerInterval = null;
        if(this.props.gameState.data.status) {
            this.timerInterval = setInterval(() => {
                this.setState({ time: this.state.time - 1 });
            }, 1000);
        }
    }

    stopTimer = () => {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    render() {
        const { status, firstNumber, secondNumber } = this.props.gameState.data;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.heart}>
                        <Text style={styles.heartText}>{this.props.heart}</Text>
                        <Icon name="favorite-border" size={25} color="#474747" style={styles.heartIcon} />
                    </View>
                    <View style={styles.timer}>
                        <Icon name="timer" size={25} color="#474747" style={styles.timerIcon} />
                        <Text style={styles.timerText}></Text>
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

export default Calc;
