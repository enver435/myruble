import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableHighlight,
    Picker
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import RNRestart from 'react-native-restart';

// import store
import store from '../../store';

// import helpers
import {
    showToast,
    getStorage,
    getFirebaseToken
} from '../../Helpers';

// import locales
import {
    translate,
    setLocale,
    getLocale
} from '../../locales';

// import components
import ProgressBar from '../../components/ProgressBar';
import Auth from '../../components/Auth';

class MyProfile extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            refreshing: false,
            user: {},
            game: {},
            locales: ['en', 'ru', 'tr']
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
                const currentLocale = await getLocale();
                const firebaseToken = await getFirebaseToken();
                const macAddress = await DeviceInfo.getMACAddress();
                const timeZone = await DeviceInfo.getTimezone();
                const deviceId = await DeviceInfo.getUniqueID();
                // update user
                if (userData && (
                    userData.firebase_token != firebaseToken ||
                    userData.timezone != timeZone ||
                    userData.device_id != deviceId ||
                    userData.locale != currentLocale
                )) {
                    await this.props.userActions.update({
                        firebase_token: firebaseToken,
                        mac_address: macAddress,
                        timezone: timeZone,
                        device_id: deviceId,
                        locale: currentLocale
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

    _changeLocale = async (locale) => {
        await setLocale(locale);
        RNRestart.Restart();
    }

    render() {
        const {
            username,
            total_referral,
            total_earn_referral,
            level,
            level_xp
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
                                    <Text style={styles.gridHeaderTitle}>{(Math.round(total_earn_referral * 1000) / 1000).toFixed(3).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} <Icon size={16} name="currency-rub" color="#474747"/></Text>
                                    <Text>{translate('ctab_myprofile_referral')}</Text>
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
                                            <Text>{translate('ctab_myprofile_referral')}</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <View style={styles.levelContainer}>
                                <View style={styles.levelHeader}>
                                    <Text style={styles.levelHeaderText}>{translate('ctab_myprofile_level')} {level}</Text>
                                    <Text style={styles.levelHeaderText}>{level_xp}/{level_end_xp}</Text>
                                </View>
                                <ProgressBar percent={progressBarPercent}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.menuContainer}>
                        <TouchableHighlight
                            underlayColor="transparent">
                            <View style={styles.menuItem}>
                                <View style={{ flex: 0 }}>
                                    <Icon size={20} name="earth" color="#474747" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.menuItemText}>{translate('ctab_myprofile_change_locale')}</Text>
                                    <Picker
                                        selectedValue={store.getState().app.locale}
                                        onValueChange={this._changeLocale}
                                        mode="dialog"
                                        style={{
                                            marginLeft: -8,
                                            marginTop: -50,
                                            backgroundColor: 'transparent',
                                            opacity: 0
                                        }}>
                                        {this.state.locales.map(item => {
                                            return <Picker.Item key={item} label={item.toUpperCase()} value={item} />
                                        })}
                                    </Picker>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="transparent"
                            onPress={() => this.props.navigation.navigate('InviteReferral')}>
                            <View style={styles.menuItem}>
                                <Icon size={20} name="account-multiple-plus" color="#474747" />
                                <Text style={styles.menuItemText}>{translate('ctab_myprofile_invite_ref')}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="transparent"
                            onPress={() => this.props.navigation.navigate('ReferralCalculator')}>
                            <View style={styles.menuItem}>
                                <Icon size={20} name="currency-rub" color="#474747" />
                                <Text style={styles.menuItemText}>{translate('ctab_myprofile_calc_ref')}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="transparent"
                            onPress={() => this.props.userActions.logout()}>
                            <View style={styles.menuItem}>
                                <Icon size={20} name="power" color="#474747" />
                                <Text style={styles.menuItemText}>{translate('ctab_myprofile_logout')}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
        ) : <Auth/>
    }
}

// component styles
const styles = StyleSheet.create({
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
    menuContainer: {
        flex: 1,
        marginTop: 15
    },
    menuItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    menuItemText: {
        color: '#474747',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 7
    }
});

export default withNavigation(MyProfile);