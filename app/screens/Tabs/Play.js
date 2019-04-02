import React, {
    Component
} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Keyboard,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

// import helpers
import {
    POST,
    showToast,
    setStorage,
    getStorage,
    getFirebaseToken,
    setResponse,
    _getLevelData
} from '../../Helpers';

// import api constants
import {
    API_URL,
    API_USER_UPDATE
} from '../../constants/api';

// import components
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
            overlayLoading: false,
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
        const {
            status,
            currentTime,
            taskSuccess
        } = this.state.game.data;
        const {
            time,
            task
        } = this.state.game.defaultData;

        if (
            status &&
            currentTime == time ||
            taskSuccess == task
        ) {
            // clear timer
            clearInterval(this.timerInterval);

            // end game
            this.endGame();

            // keyboard dismiss
            Keyboard.dismiss();
        }

        // if game status stop
        if (!status) {
            // clear timer
            clearInterval(this.timerInterval);
        }
    }

    endGame = () => {
        this.setState({
            overlayLoading: true
        }, async () => {
            const {
                taskSuccess,
                taskFail
            } = this.state.game.data;
            const {
                task,
                earn,
                earn_xp,
                referral_percent
            } = this.state.game.defaultData;
            const {
                level_xp,
                ref_user_id
            } = this.state.user.data;
            const {
                currentLevel,
                maxLevel
            } = _getLevelData(level_xp);

            // dispatch action game results
            const earn_referral = earn * referral_percent / 100;
            const resultData = {
                user_id: this.state.user.data.id,
                task_success: taskSuccess,
                task_fail: taskFail,
                earn: taskSuccess == task ? earn : 0,
                earn_referral: taskSuccess == task ? earn_referral : 0,
                status: taskSuccess == task ? 1 : 0,
                time: Math.round(new Date().getTime() / 1000)
            };

            // dispatch action result game
            const resultRes = await this.props.gameActions.resultGame(resultData);
            if (resultRes.status) {
                // if task completed update user
                if (taskSuccess == task) {
                    // update user
                    let updateUserByMeData = {
                        balance: {
                            increment: true,
                            value: earn
                        }
                    };
                    if (maxLevel.level > currentLevel.level) {
                        updateUserByMeData.level_xp = {
                            increment: true,
                            value: earn_xp
                        };
                    }
                    await this.updateUserByMe(updateUserByMeData);

                    // update referral balance
                    await this.updateUser(ref_user_id, {
                        balance: {
                            increment: true,
                            value: earn_referral
                        }
                    });
                }
            } else {
                showToast(resultRes.message);
            }

            this.setState({
                overlayLoading: false
            }, () => {
                // set visible result modal
                this.setVisibleResultModal(true);
            });
        });
    }

    startGame = () => {
        const {
            heart_time
        } = this.state.game.defaultData;
        const {
            heart
        } = this.state.user.data;

        this.setState({
            overlayLoading: true
        }, async () => {
            if (heart > 0) {
                // update user heart
                const updateHeartRes = await this.updateUserByMe({
                    heart: {
                        decrement: true,
                        value: 1
                    }
                });

                if (updateHeartRes.status) {
                    // dispatch action start game
                    await this.props.gameActions.startGame();

                    // start timer
                    this.timerInterval = setInterval(() => {
                        // dispatch action current time
                        this.props.gameActions.setCurrentTime();

                        // check end game
                        this.checkEndGame();
                    }, 1000);
                }
            } else {
                // set time open heart modal
                if (!await getStorage('heartModalOpenTime')) {
                    // get open time
                    const openTime = Math.round((new Date().getTime() / 1000) + heart_time).toString();

                    // set storage
                    await setStorage('heartModalOpenTime', openTime);

                    // update user
                    await this.updateUserByMe({
                        notify_heart_time: openTime
                    });
                }

                // set visible heart modal
                this.setVisibleHeartModal(true);
            }

            this.setState({
                overlayLoading: false
            });
        });
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
        const {
            status
        } = this.state.game.data;

        if (status) {
            // dispatch action check answer correct
            this.props.gameActions.checkAnswer(answer);

            // dispatch action next question
            this.props.gameActions.nextQuestion();

            // check end game
            this.checkEndGame();
        }
    }

    updateUserByMe = async (data) => {
        // dispatch action update user
        const response = await this.props.userActions.update(data);
        if (!response.status) {
            showToast(response.message);
        }
        return response;
    }

    updateUser = async (id, data) => {
        try {
            // post request update user data
            const response = await POST(API_URL + API_USER_UPDATE, {
                id,
                data
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
            const userData = await getStorage('userData');
            const firebaseToken = await getFirebaseToken();
            // if new firebase token
            if (userData && userData.firebase_token != firebaseToken) {
                await this.props.userActions.update({
                    firebase_token: firebaseToken
                });
            }
        } else {
            // show error message
            if (userRes.message != 'Error: Not auth!') {
                showToast(userRes.message);
            }
        }

        /**
         * Get Default Game Information
         */
        if (userRes.status) {
            const levelRes = await this.props.gameActions.getLevels();
            if (levelRes.status) {
                await this.props.gameActions.getLevelData(userRes.data.level_xp);
            } else {
                // show error message
                showToast(levelRes.message);
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
        return this.state.user.isAuth === true ? (
            <View style={{ flex: 1 }}>
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
                        this.setState({
                            overlayLoading: true
                        }, async () => {
                            await this.updateUserByMe({
                                heart: {
                                    increment: true,
                                    value: 1
                                },
                                notify_heart_time: 0
                            });
                            this.setState({
                                overlayLoading: false
                            });
                        });
                    }}
                    visible={this.state.heartModalVisible}/>

                {this.state.overlayLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#474747" />
                    </View>
                }
            </View>
        ) : (
            <View style={styles.screenCenter}>
                <Text style={{ textAlign: 'center' }}>Пожалуйста, войдите, чтобы просмотреть эту страницу.</Text>
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    screenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#F5FCFF88',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Play;