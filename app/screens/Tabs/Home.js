import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Keyboard } from 'react-native';

// import components
import Loading from '../../components/Loading';
import Balance from '../../components/Home/Balance';
import Enter from '../../components/Home/Enter';
import Main from '../../components/Home/Main';
import Control from '../../components/Home/Control';

class Home extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            user: props.userState,
            game: props.gameState
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.user !== nextProps.userState) {
            return {
                user: nextProps.userState
            };
        } else if(prevState.game !== nextProps.gameState) {
            return {
                game: nextProps.gameState
            };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        const gameData = prevProps.gameState.data;
        const gameDefaultData = prevProps.gameState.defaultData;
        if(gameData.status && (gameData.currentTime+1) >= gameDefaultData.time) {
            // get result game
            this.props.gameActions.resultsGame();
            // keyboard dismiss
            Keyboard.dismiss();
            // clear timer
            clearInterval(this.timerInterval);
        }
    }

    startGame = () => {
        // dispatch action start game
        this.props.gameActions.startGame();
        // start timer
        let currentTime = 0;
        this.timerInterval = setInterval(() => {
            currentTime++;
            this.props.gameActions.setCurrentTime(currentTime);
        }, 1000);
    }

    stopGame = () => {
        // dispatch action stop game
        this.props.gameActions.stopGame();
        // keyboard dismiss
        Keyboard.dismiss();
        // clear timer
        clearInterval(this.timerInterval);
    }

    sendAnswer = (correct) => {
        this.props.gameActions.nextGame(correct);
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
                            correctAnswer={this.state.game.data.correctAnswer}
                            sendAnswer={this.sendAnswer}/>
                        <Control
                            status={this.state.game.data.status}
                            startGame={this.startGame}
                            stopGame={this.stopGame}/>
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