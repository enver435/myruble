import React, {
    Component
} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Keyboard,
    RefreshControl
} from 'react-native';

// import helpers
import {
    POST,
    showToast,
    setStorage,
    getStorage,
    getFirebaseToken,
    setResponse
} from '../../Helpers';

// import api constants
import {
    API_URL,
    API_USER_UPDATE
} from '../../constants/api';

// import components
import Loading from '../../components/Loading';
import Balance from '../../components/Home/Balance';
import Enter from '../../components/Home/Enter';
import Main from '../../components/Home/Main';
import Control from '../../components/Home/Control';
import ResultModal from '../../components/Home/Modals/ResultModal';
import HeartModal from '../../components/Home/Modals/HeartModal';

class Play extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            refreshing: false,
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

    componentDidMount() {
        // set mount
        this._isMounted = true;
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    checkEndGame = () => {
        const gameData        = this.state.game.data;
        const gameDefaultData = this.state.game.defaultData;
        if (
            gameData.status &&
            gameData.currentTime == gameDefaultData.time ||
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
        const gameData        = this.state.game.data;
        const gameDefaultData = this.state.game.defaultData;

        // dispatch action game results
        const resultData = {
            user_id: this.state.user.data.id,
            task_success: gameData.taskSuccess,
            task_fail: gameData.taskFail,
            earn: gameData.taskSuccess == gameDefaultData.task ? gameDefaultData.earn : 0,
            status: gameData.taskSuccess == gameDefaultData.task ? 1 : 0,
            time: Math.round(new Date().getTime() / 1000)
        };

        // dispatch action result game
        const resultRes = await this.props.gameActions.resultGame(resultData);
        if (resultRes.status) {
            // if task completed update user balance
            if (gameData.taskSuccess == gameDefaultData.task) {
                const userRes = await this.props.userActions.get();
                if (userRes.status) {
                    // update balance
                    this.updateUserByMe({
                        balance: this.state.user.data.balance + gameDefaultData.earn
                    });
                } else {
                    showToast(userRes.message);
                }
            }
        } else {
            showToast(resultRes.message);
        }

        // set visible result modal
        this.setVisibleResultModal(true);
    }

    startGame = async () => {
        if (this.state.user.data.heart > 0) {
            // update user heart
            this.updateUserByMe({
                heart: this.state.user.data.heart - 1
            });

            // dispatch action start game
            this.props.gameActions.startGame();

            // start timer
            this.timerInterval = setInterval(() => {
                // dispatch action current time
                this.props.gameActions.setCurrentTime();

                // check end game
                this.checkEndGame();
            }, 1000);
        } else {
            // set time open heart modal
            if (!await getStorage('heartModalOpenTime')) {
                // get open time
                const openTime = Math.round((new Date().getTime() / 1000) + this.state.game.defaultData.heart_time).toString();

                // set storage
                await setStorage('heartModalOpenTime', openTime);

                // update user
                this.updateUserByMe({
                    notify_heart_time: openTime
                });
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
        const gameData = this.state.game.data;
        if (gameData.status) {
            // dispatch action check answer correct
            this.props.gameActions.checkAnswer(answer);

            // dispatch action next question
            this.props.gameActions.nextQuestion();

            // check end game
            this.checkEndGame();
        }
    }

    updateUserByMe = (data) => {
        // dispatch action update user
        this.props.userActions.update(data).then((response) => {
            if (!response.status) {
                showToast(response.message);
            }
        });
    }

    updateUser = async (id, data) => {
        try {
            // post request update user data
            const response = await POST(API_URL + API_USER_UPDATE, {
                id,
                data: { ...data }
            });
    
            // return response
            return setResponse(response.data);
        } catch (err) {
            // return response
            return setResponse({
                status: false,
                message: err.message
            });
        }
    }

    _onRefresh = async () => {
        // show refreshing
        this.setState({
            refreshing: true
        });

        /**
         * Get User
         */
        const userRes = await this.props.userActions.get();
        if (userRes.status) {
            const userData      = await getStorage('userData');
            const firebaseToken = await getFirebaseToken();
            // if new firebase token
            if (userData && userData.firebase_token != firebaseToken) {
                await this.props.userActions.update({
                    firebase_token: firebaseToken
                });
            }
        } else {
            // show error message
            if(userRes.message != 'Error: Not auth!') {
                showToast(userRes.message);
            }
        }
        
        /**
         * Get Default Game Information
         */
        if (userRes.status) {
            const gameResponse = await this.props.gameActions.getLevels();
            if (gameResponse.status) {
                await this.props.gameActions.getLevelData(userRes.data.level_xp);
            } else {
                // show error message
                showToast(gameResponse.message);
            }
        }

        // hide refreshing
        if (this._isMounted) {
            this.setState({
                refreshing: false
            });
        }
    }

    setVisibleResultModal = (visible) => {
        this.setState({
            resultModalVisible: visible
        });
    }

    setVisibleHeartModal = (visible) => {
        this.setState({
            heartModalVisible: visible
        });
    }

    render() {
        return this.state.loading === true ? (
            <Loading/>
        ) : (
            this.state.user.isAuth === true ? (
                <View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }>
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

                    <ResultModal
                        hideVisible={() => { this.setVisibleResultModal(false) }}
                        visible={this.state.resultModalVisible}
                        gameState={this.state.game}/>

                    <HeartModal
                        hideVisible={() => { this.setVisibleHeartModal(false) }}
                        updateHeart={() => {
                            this.updateUserByMe({
                                heart: this.state.user.data.heart + 1,
                                notify_heart_time: 0
                            })
                        }}
                        visible={this.state.heartModalVisible}/>
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

export default Play;