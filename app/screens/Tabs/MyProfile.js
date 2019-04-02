import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import helpers
import {
    showToast,
    getStorage,
    getFirebaseToken
} from '../../Helpers';

// import components
import ReferralList from '../../components/ReferralList';

class MyProfile extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            refreshing: false,
            user: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let obj = {};
        if (prevState.user !== nextProps.userState) {
            obj.user = nextProps.userState;
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

            // hide refrehsing
            if (this._isMounted) {
                this.setState({
                    refreshing: false
                });
            }
        });
    }

    render() {
        const {
            username,
            total_referral,
            total_earn_referral
        } = this.state.user.data;

        return this.state.user.isAuth === true ? (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.gridHeader}>
                                <View style={styles.gridHeaderItem}>
                                    <Text style={styles.gridHeaderTitle}>{total_earn_referral.toFixed(2)} <Icon size={16} name="currency-rub" color="#474747"/></Text>
                                    <Text>pеферал</Text>
                                </View>
                                <View style={styles.gridHeaderItem}>
                                    <Icon size={80} name="account-circle-outline" color="#474747"/>
                                    <Text style={styles.gridHeaderTitle}>{username}</Text>
                                </View>
                                <View style={styles.gridHeaderItem}>
                                    <Text style={styles.gridHeaderTitle}>{total_referral}</Text>
                                    <Text>pеферал</Text>
                                </View>
                            </View>
                            <View style={styles.levelContainer}>
                                <Text>dwqdqwdqw</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.referralContainer}>
                    <View>
                        <Text style={styles.referralText}>Мои рефералы</Text>
                    </View>
                    {!this.state.refreshing ? (
                        <ReferralList/>
                    ) : null}
                </View>
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
    referralContainer: {
        flex: 1,
        paddingTop: 20
    },
    referralText: {
        color: '#979797',
        fontSize: 12,
        textAlign: 'center'
    },
    levelContainer: {

    }
});

export default MyProfile;