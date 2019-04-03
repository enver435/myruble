import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    fmtMSS = (s) => {
        return s < 0 || isNaN(s) ? this.fmtMSS(0) : (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }

    render() {
        const {
            status,
            firstNumber,
            secondNumber,
            taskSuccess,
            currentTime
        } = this.props.gameState.data;
        const {
            task,
            time
        } = this.props.gameState.defaultData;
        const {
            heart
        } = this.props.userState.data;

        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.heartContainer}>
                        <Text style={styles.heartText}>{heart}</Text>
                        <Icon name="favorite-border" size={25} color="#474747" style={styles.heartIcon} />
                    </View>
                    <View style={styles.taskContainer}>
                        {status ? (
                            <Text style={styles.taskText}>{taskSuccess} / {task}</Text>
                        ) : null}
                    </View>
                    <View style={styles.timerContainer}>
                        <Icon name="timer" size={25} color="#474747" style={styles.timerIcon} />
                        <Text style={styles.timerText}>{this.fmtMSS(time - currentTime)}</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    contentText: {
        fontSize: 32,
        textAlign: 'center',
        color: '#474747'
    },
    headerContainer: {
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    heartContainer: {
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
    timerContainer: {
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
    },
    taskContainer: {
        flex: 1
    },
    taskText: {
        textAlign: 'center'
    }
});

// component prop types
Main.propTypes = {
    userState: PropTypes.object.isRequired,
    gameState: PropTypes.object.isRequired
};

export default Main;