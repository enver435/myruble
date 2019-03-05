import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Keyboard } from 'react-native';
import Axios from 'axios';

// import components
import Loading from '../../components/Loading';
import Balance from '../../components/Home/Balance';
import Enter from '../../components/Home/Enter';
import Main from '../../components/Home/Main';
import Control from '../../components/Home/Control';
import GameResults from '../../components/Home/GameResults';

// import api constants
import { 
    API_URL,
    API_INSERT_GAME
} from '../../constants/api';

class Home extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            resultModalVisible: false,
            user: {},
            game: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let obj = {};
        if (prevState.user !== nextProps.userState) {
            obj.user = nextProps.userState;
        }
        if (prevState.game !== nextProps.gameState) {
            obj.game = nextProps.gameState;
        }
        return Object.keys(obj).length > 0 ? obj : null;
    }

    componentDidUpdate(prevProps) {
        const gameData = prevProps.gameState.data;
        const gameDefaultData = prevProps.gameState.defaultData;
        if(
            gameData.status && 
            gameData.currentTime == gameDefaultData.time ||
            gameData.taskSuccess == gameDefaultData.task
        ) {
            // end game
            this.endGame();
            // keyboard dismiss
            Keyboard.dismiss();
            // clear timer
            clearInterval(this.timerInterval);
        }
    }

    endGame = async () => {
        // dispatch action end game
        this.props.gameActions.resultsGame();
        // set visible result modal
        this.setVisibleModal(true);
        // post request, insert game result
        const gameData = this.state.game.data;
        const gameDefaultData = this.state.game.defaultData; 
        await Axios.post(API_URL + API_INSERT_GAME, {
            user_id: this.state.user.data.id,
            task_success: gameData.taskSuccess,
            task_fail: gameData.taskFail,
            earn: gameData.taskSuccess == gameDefaultData.task ? gameDefaultData.price : 0,
            status: gameData.taskSuccess == gameDefaultData.task ? 1 : 0,
            time: Math.round(new Date().getTime() / 1000)
        });
    }

    setVisibleModal = (visible) => {
        this.setState({ resultModalVisible: visible });
    }

    startGame = () => {
        // dispatch action start game
        this.props.gameActions.startGame();
        // start timer
        this.timerInterval = setInterval(() => {
            this.props.gameActions.setCurrentTime();
        }, 1000);
    }

    stopGame = () => {
        // end game
        this.endGame();
        // keyboard dismiss
        Keyboard.dismiss();
        // clear timer
        clearInterval(this.timerInterval);
    }

    sendAnswer = (answer) => {
        // dispatch action check answer correct
        this.props.gameActions.checkAnswer(answer);
        // dispatch action next question
        this.props.gameActions.nextQuestion();
    }

    render() {
        return this.state.loading === true ? (
            <Loading/>
        ) : (
            this.state.user.isAuth === true ? (
                <View>
                    <ScrollView>
                        <Balance userState={this.state.user}/>
                        <Main
                            userState={this.state.user}
                            gameState={this.state.game}/>
                        <Enter
                            sendAnswer={this.sendAnswer}/>
                        <Control
                            status={this.state.game.data.status}
                            startGame={this.startGame}
                            stopGame={this.stopGame}/>
                        <GameResults
                            gameState={this.state.game}
                            visible={this.state.resultModalVisible}
                            hideVisible={() => { this.setVisibleModal(false) }}/>
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.screenCenter}>
                    <Text style={{ textAlign: 'center' }}>Пожалуйста, войдите, чтобы просмотреть эту страницу.</Text>
                </View>
            )
        );
    }
}

// component styles
const styles = StyleSheet.create({
    screenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Home;