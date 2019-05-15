import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    Clipboard,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import helpers
import {
    POST,
    showToast,
    setResponse
} from '../Helpers';

// import api constants
import {
    API_INSERT_REFERRAL
} from '../constants/api';

class InviteReferral extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            overlayLoading: false,
            ref_code: '',
            user: {}
        };
    }

    static navigationOptions = () => {
        return {
            title: 'Приглашайте pеферал'
        };
    };

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

    _onClickSend = async () => {
        // keyboard dismiss
        Keyboard.dismiss();

        // set state
        this.setState({
            overlayLoading: true
        });

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
    }

    _copyReferralClipboard = (str) => {
        Clipboard.setString(str);
        showToast('Cкопирован в буфер обмена');
    }

    render() {
        const {
            referral_code,
            ref_user_id
        } = this.state.user.data;

        return (
            <View style={styles.container}>
                <View style={{ paddingLeft: 15, paddingRight: 15, alignItems: 'center', marginBottom: 10 }}>
                    <View>
                        <Text style={styles.referralText}>Ваша код для привлечения рефералов:</Text>
                        <TouchableHighlight
                            underlayColor="transparent"
                            onPress={() => this._copyReferralClipboard(referral_code)}>
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
                </View>
                <View style={styles.refUrl}>
                    <TouchableHighlight
                        underlayColor="transparent"
                        onPress={() => this._copyReferralClipboard(`http://myruble.com/register/${referral_code}`)}>
                        <Text style={{ color: '#474747' }}>http://myruble.com/register/{referral_code} <Icon size={20} name="content-copy" color="#474747"/></Text>
                    </TouchableHighlight>
                </View>
                {this.state.overlayLoading &&
                    <View style={styles.overlayLoading}>
                        <ActivityIndicator size="large" color="#474747" />
                    </View>
                }
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fafafa',
        alignContent: 'center',
        paddingTop: 20
    },
    referralText: {
        color: '#474747',
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
        marginBottom: 10,
        marginTop: 10
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
    },
    refUrl: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    }
});

export default InviteReferral;