import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    Clipboard
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import helpers
import {
    POST,
    showToast,
    getStorage,
    getFirebaseToken,
    setResponse
} from '../../Helpers';

// import components
import ProgressBar from '../../components/ProgressBar';

// import api constants
import {
    API_INSERT_REFERRAL
} from '../../constants/api';

class MyProfile extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            refreshing: false,
            overlayLoading: false,
            ref_code: '',
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

    _onRefresh = async () => {
        this.setState({
            refreshing: true
        }, async () => {
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
                showToast(userRes.message);
            }

            /**
             * Get Default Game Information
             */
            if (userRes.status) {
                const levelRes = await this.props.gameActions.getLevels();
                if (levelRes.status) {
                    await this.props.gameActions.getLevelData(userRes.data.level);
                } else {
                    // show error message
                    showToast(levelRes.message);
                }
            }

            // hide refrehsing
            if (this._isMounted) {
                this.setState({
                    refreshing: false
                });
            }
        });
    }

    _insertReferral = async () => {
        try {
            const response = await POST(API_INSERT_REFERRAL, {
                user_id: this.state.user.data.id,
                ref_code: this.state.ref_code
            });
            return response;
        } catch (err) {
            return setResponse({
                status: false,
                message: err.message
            });
        }
    }

    _onClickSend = () => {
        this.setState({
            overlayLoading: true
        }, async () => {
            const response = await this._insertReferral();
            if (response.status) {
                // dispatch action, get user information
                const userRes = await this.props.userActions.get();
                if (!userRes.status) {
                    // show error message
                    showToast(userRes.message);
                }
            } else {
                showToast(response.message);
            }

            // set state
            this.setState({
                overlayLoading: false
            });
        });
    }

    _copyReferralClipboard = () => {
        Clipboard.setString(this.state.user.data.referral_code);
        showToast('Код реферала скопирован в буфер обмена');
    }

    render() {
        const {
            username,
            total_referral,
            total_earn_referral,
            level,
            level_xp,
            referral_code,
            ref_user_id
        } = this.state.user.data;
        const {
            level_start_xp,
            level_end_xp
        } = this.state.game.defaultData;
        const progressBarPercent = ((level_xp - level_start_xp) / level_end_xp) * 100;

        return this.state.user.isAuth === true ? (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    contentContainerStyle={{flexGrow: 1}}>    
                    <View style={styles.headerContainer}>                
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.gridHeader}>
                                <View style={styles.gridHeaderItem}>
                                    <Text style={styles.gridHeaderTitle}>{total_earn_referral.toFixed(3)} <Icon size={16} name="currency-rub" color="#474747"/></Text>
                                    <Text>pеферал</Text>
                                </View>
                                <View style={styles.gridHeaderItem}>
                                    <Icon size={80} name="account-circle-outline" color="#474747"/>
                                    <Text style={styles.gridHeaderTitle}>{username}</Text>
                                </View>
                                <View style={styles.gridHeaderItem}>
                                    <TouchableHighlight
                                        underlayColor="transparent"
                                        onPress={() => { this.props.navigation.navigate('MyReferrals'); }}>
                                        <View style={{ alignContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                            <Text style={styles.gridHeaderTitle}>{total_referral}</Text>
                                            <Text>pеферал</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <View style={styles.levelContainer}>
                                <View style={styles.levelHeader}>
                                    <Text style={styles.levelHeaderText}>Уровень {level}</Text>
                                    <Text style={styles.levelHeaderText}>{level_xp}/{level_end_xp}</Text>
                                </View>
                                <ProgressBar percent={progressBarPercent}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.referralContainer}>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.referralText}>Ваша код для привлечения рефералов:</Text>
                            <TouchableHighlight
                                underlayColor="transparent"
                                onPress={this._copyReferralClipboard}>
                                <Text style={styles.referralCode}>{referral_code} <Icon size={30} name="content-copy" color="#474747"/></Text>
                            </TouchableHighlight>
                        </View>
                        <View style={ref_user_id ? [styles.referralForm, { opacity: 0.5 }] : styles.referralForm}
                            pointerEvents={ref_user_id ? "none" : "auto"}>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid="#474747"
                                keyboardType="numeric"
                                returnKeyType="next"
                                value={ref_user_id ? ref_user_id.toString().padStart(6, '0') : this.state.input}
                                onChangeText={(ref_code) => this.setState({ ref_code })}
                                onSubmitEditing={this.state.overlayLoading ? null : () => this._onClickSend()}
                                blurOnSubmit={false}
                            />
                            <TouchableHighlight
                                onPress={this.state.overlayLoading ? null : () => this._onClickSend()}
                                underlayColor="transparent">
                                <Icon name="send" size={35} color="#474747" style={styles.btnSend} />
                            </TouchableHighlight>
                        </View>
                        <View>
                            <Text style={styles.referralText}>Невозможно изменить реферальный код, если он написан.</Text>
                        </View>
                        {this.state.overlayLoading &&
                            <View style={styles.overlayLoading}>
                                <ActivityIndicator size="large" color="#474747" />
                            </View>
                        }
                    </View>
                </ScrollView>
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
    container: {
        flex: 1,
        paddingTop: 20,
        flexDirection: 'column',
        backgroundColor: '#fafafa'
    },
    headerContainer: {
        flex: 0,
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc',
        paddingBottom: 20
    },
    gridHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    gridHeaderItem: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    gridHeaderTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#474747'
    },
    levelContainer: {
        flexDirection: 'column',
        marginTop: 15
    },
    levelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    levelHeaderText: {
        fontSize: 13,
        marginBottom: 3,
    },
    referralContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingLeft: 35,
        paddingRight: 35
    },
    referralText: {
        color: '#979797',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10
    },
    referralCode: {
        color: '#474747',
        fontSize: 35,
        textAlign: 'center'
    },
    referralForm: {
        flexDirection: 'row',
        marginBottom: 10
    },
    textInput: {
        fontSize: 17,
        flex: 1
    },
    btnSend: {
        marginTop: 7
    },
    overlayLoading: {
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

export default withNavigation(MyProfile);