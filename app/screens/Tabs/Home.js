import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Keyboard } from 'react-native';

// import helpers
import { showToast, setStorage, getStorage } from '../../Helpers';

// import components
import Loading from '../../components/Loading';
import Balance from '../../components/Home/Balance';
import Enter from '../../components/Home/Enter';
import Main from '../../components/Home/Main';
import Control from '../../components/Home/Control';
import ResultModal from '../../components/Home/ResultModal';
import HeartModal from '../../components/Home/HeartModal';

class Home extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            resultModalVisible: false,
            heartModalVisible: false,
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
        const gameData        = prevProps.gameState.data;
        const gameDefaultData = prevProps.gameState.defaultData;
        if(
            gameData.status && 
            (gameData.currentTime+1) == gameDefaultData.time ||
            gameData.taskSuccess == gameDefaultData.task
        ) {
            // clear timer
            clearInterval(this.timerInterval);

            // end game
            this.endGame();

            // keyboard dismiss
            Keyboard.dismiss();
        }
    }

    endGame = async () => {
        const gameData = this.state.game.data;
        const gameDefaultData = this.state.game.defaultData;

        // dispatch action game results
        const resultData = {
            user_id: this.state.user.data.id,
            task_success: gameData.taskSuccess,
            task_fail: gameData.taskFail,
            earn: gameData.taskSuccess == gameDefaultData.task ? gameDefaultData.price : 0,
            status: gameData.taskSuccess == gameDefaultData.task ? 1 : 0,
            time: Math.round(new Date().getTime() / 1000)
        };
        this.props.gameActions.resultsGame(resultData).then((response) => {
            if(!response.status) {
                showToast(response.message);
            }
        });

        // dispatch action update user
        if(gameData.taskSuccess == gameDefaultData.task) {
            const updateData = {
                balance: this.state.user.data.balance + gameDefaultData.price
            };
            this.props.userActions.update(updateData).then((response) => {
                if(!response.status) {
                    showToast(response.message);
                }
            });
        }

        // set visible result modal
        this.setVisibleResultModal(true);
    }

    setVisibleResultModal = (visible) => {
        this.setState({ resultModalVisible: visible });
    }

    setVisibleHeartModal = (visible) => {
        this.setState({ heartModalVisible: visible });
    }

    startGame = async () => {
        if(this.state.user.data.heart > 0) {
            // update user heart
            this.updateHeart(this.state.user.data.heart - 1);

            // dispatch action start game
            this.props.gameActions.startGame();

            // start timer
            this.timerInterval = setInterval(() => {
                this.props.gameActions.setCurrentTime();
            }, 1000);
        } else {
            // set time open heart modal
            if(!await getStorage('heartModalOpenTime')) {
                const nowTime = Math.round(new Date().getTime() / 1000).toString();
                await setStorage('heartModalOpenTime', nowTime);
            }

            // set visible heart modal
            this.setVisibleHeartModal(true);
        }
    }

    stopGame = () => {
        // clear timer
        clearInterval(this.timerInterval);

        // end game
        this.endGame();

        // keyboard dismiss
        Keyboard.dismiss();
    }

    sendAnswer = (answer) => {
        // dispatch action check answer correct
        this.props.gameActions.checkAnswer(answer);

        // dispatch action next question
        this.props.gameActions.nextQuestion();
    }

    updateHeart = (heartCount) => {
        // dispatch action update user
        const updateData = { heart: heartCount };
        this.props.userActions.update(updateData).then((response) => {
            if(!response.status) {
                showToast(response.message);
            }
        });
    }

    render() {
        return this.state.loading === true ? (
            <Loading/>
        ) : (
            this.state.user.isAuth === true ? (
                <View>
                    <ScrollView>
                        <Balance
                            userState={this.state.user}/>
                        <Main
                            userState={this.state.user}
                            gameState={this.state.game}/>
                        <Enter
                            sendAnswer={this.sendAnswer}/>
                        <Control
                            status={this.state.game.data.status}
                            startGame={this.startGame}
                            stopGame={this.stopGame}/>
                    </ScrollView>

                    {this.state.resultModalVisible ?
                        <ResultModal
                            gameState={this.state.game}
                            hideVisible={() => { this.setVisibleResultModal(false) }}/> : null}

                    {this.state.heartModalVisible ?
                        <HeartModal
                            hideVisible={() => { this.setVisibleHeartModal(false) }}
                            updateHeart={() => { this.updateHeart(this.state.user.data.heart + 1) }}/> : null}
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