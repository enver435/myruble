import React, {
    Component
} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TextInput,
    ScrollView,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import {
    Button
} from 'react-native-elements';
import {
    withNavigation
} from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import helpers
import {
    POST,
    setResponse,
    showToast
} from '../../Helpers';

// import api constants
import {
    API_INSERT_WITHDRAW
} from '../../constants/api';
import { translate } from '../../locales';

class Payment extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            wallet_number: '',
            amount: 0
        };
        this.inputs = {};
    }

    componentDidMount() {
        // set mount
        this._isMounted = true;
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    _withdraw = async (data) => {
        try {
            const {
                isAuth
            } = this.props.userState;
            if (isAuth) {
                const response = await POST(API_INSERT_WITHDRAW, data);
                // return response
                return response;
            }
            // set error
            throw new Error('Error: Not auth!');
        } catch (err) {
            return setResponse({
                status: false,
                message: err.message
            });
        }
    }

    _onClickWithdraw = async () => {
        // set state
        this.setState({
            loading: true
        });

        const {
            id
        } = this.props.userState.data;
        const {
            method
        } = this.props.withdrawState.methodData;
        
        // status variables
        let navigateStatus = false;
    
        // create object withdraw data
        const withdrawData = {
            user_id: id,
            amount: this.state.amount,
            method,
            wallet_number: this.state.wallet_number.toUpperCase(),
        };

        // request withdraw data
        const resWithdraw = await this._withdraw(withdrawData);

        if (resWithdraw.status) {
            // set navigate status
            navigateStatus = true;

            // navigate main screen
            this.props.navigation.navigate('Main');
        }

        // show toast
        showToast(resWithdraw.message);
    
        // set state
        if (this._isMounted && !navigateStatus) {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const {
            method,
            commission
        } = this.props.withdrawState.methodData;
        const commissionBalance = this.state.amount + (commission * this.state.amount / 100);

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
                    <View>
                        <View style={styles.imgContainer}>
                            {method == 1 ? (
                                <Image source={require('../../assets/yandex.png')} resizeMode="contain" style={styles.paymentImg}/>
                            ) : (method == 2 ? (
                                <Image source={require('../../assets/payeer.png')} resizeMode="contain" style={styles.paymentImg}/>
                            ) : (method == 3 ? (
                                <Image source={require('../../assets/webmoney.png')} resizeMode="contain" style={styles.paymentImg}/>
                            ): null))}
                        </View>
                        <View>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="#474747"
                                returnKeyType="next"
                                placeholder={translate('c_withdraw_input_wallet', {
                                    wallet: (method == 1 ? '410011111111111' : (method == 2 ? 'P12345678' : (method == 3 ? 'R123456789111' : '')))
                                })}
                                autoCapitalize="none"
                                onChangeText={(wallet_number) => this.setState({ wallet_number })}
                                onSubmitEditing={() => { this.inputs['amount'].focus(); }}
                            />
                            <TextInput
                                ref={input => { this.inputs['amount'] = input }}
                                style={styles.input}
                                keyboardType="decimal-pad"
                                underlineColorAndroid="#474747"
                                placeholder={translate('c_withdraw_input_amount')}
                                autoCapitalize="none"
                                onChangeText={(amount) => this.setState({ amount: parseFloat(amount) })}
                            />
                            {this.state.amount > 0 ? (
                                <Text>
                                    {translate('c_withdraw_total_amount', {
                                        amount: commissionBalance.toFixed(2)
                                    })} <Icon size={15} name="currency-rub" color="#474747"/>
                                </Text>
                            ) : null}
                            <Button
                                onPress={this._onClickWithdraw}
                                title="OK"
                                loading={this.state.loading}
                                disabled={this.state.loading}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

// component prop types
Payment.propTypes = {
    onChangeScreen: PropTypes.func.isRequired,
    withdrawState: PropTypes.object.isRequired,
    userState: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired
};

// component styles
const styles = StyleSheet.create({
    scrollView: {
        height: Dimensions.get('window').height,
    },
    container: {
        paddingTop: 20,
        paddingLeft: 25,
        paddingRight: 25,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fafafa'
    },
    imgContainer: {
        flex: 0,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    paymentImg: {
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        fontSize: 15,
        marginBottom: 10,
    },
});

export default withNavigation(Payment);