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
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';0

// import helpers
import {
    POST,
    setResponse,
    showToast
} from '../../Helpers';

// import api constants
import {
    API_URL,
    API_INSERT_WITHDRAW
} from '../../constants/api';

class Payment extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            wallet_number: '',
            amount: 0,
            methodName: ''
        };
        this.inputs = {};
    }

    componentDidMount() {
        // set mount
        this._isMounted = true;

        // get payment method name
        this._getPaymentMethod();
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    _getPaymentMethod = () => {
        const { method } = this.props.withdrawState.payment;
        const methodName = method == 1 ? 'yandex' : (method == 2 ? 'payeer' : (method == 3 ? 'webmoney' : null));
        this.setState({ methodName });
    }

    _insertData = async (data) => {
        try {
            const { isAuth } = this.props.userState;
            if(isAuth) {
                const response = await POST(API_URL + API_INSERT_WITHDRAW, data);
                // return response
                return setResponse(response.data);
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

    _onClickWithdraw = () => {
        this.setState({ loading: true }, async () => {
            // get user data
            const { id, balance } = this.props.userState.data;
            
            // get payment method information
            const { method, commission, min_withdraw } = this.props.withdrawState.payment;

            // calculate commission balance
            const commissionBalance = parseFloat((this.state.amount + (commission * this.state.amount / 100)).toFixed(2));

            // insert status
            let insertStatus = false;

            if(this.state.amount > 0 && this.state.wallet_number != '') {
                if(this.state.amount < min_withdraw) {
                    showToast('Можно снять как минимум ' + min_withdraw.toFixed(2) + ' рублей');
                } else if(commissionBalance > balance) {
                    showToast('Ваш баланс не хватает');
                } else {
                    insertStatus = true;
                }
            } else {
                showToast('Пожалуйста, заполните информацию');
            }

            // if insert status true
            if(insertStatus) {

                // update user balance
                const resUpdate = await this.props.userActions.update({
                    balance: balance - commissionBalance
                });

                if(resUpdate.status) {
                    // create object insert data
                    const insertData = {
                        user_id: id,
                        amount: this.state.amount,
                        commission,
                        payment_method: method,
                        wallet_number: this.state.wallet_number,
                        payment_status: 0,
                        time: Math.round(new Date().getTime() / 1000)
                    };

                    // request insert data
                    const resInsert = await this._insertData(insertData);
                    if(resInsert.status) {
                        showToast('Ваш запрос был успешно отправлен. Это будет сделано в течение 24 часов.');
                        // navigate main screen
                        this.props.navigation.navigate('Main');
                    } else {
                        showToast(resInsert.message);
                    }
                } else {
                    showToast(resUpdate.message);
                }
                
            }

            if(this._isMounted) {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        const { method, commission } = this.props.withdrawState.payment;
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
                                placeholder={'Кошелек (пример: ' + (method == 1 ? '410011111111111' : (method == 2 ? 'P12345678' : (method == 3 ? 'R123456789111' : null))) + ')'}
                                autoCapitalize="none"
                                onChangeText={(wallet_number) => this.setState({ wallet_number })}
                                onSubmitEditing={() => { this.inputs['amount'].focus(); }}
                            />
                            <TextInput
                                ref={input => { this.inputs['amount'] = input }}
                                style={styles.input}
                                keyboardType="decimal-pad"
                                underlineColorAndroid="#474747"
                                placeholder="Сумма"
                                autoCapitalize="none"
                                onChangeText={(amount) => this.setState({ amount: parseFloat(amount) })}
                            />
                            {this.state.amount > 0 ? (
                                <Text>К оплате {commissionBalance.toFixed(2)} <Icon size={15} name="currency-rub" color="#474747"/>, с учетом комиссии {commission.toFixed(2)} %</Text>
                            ) : null}
                            <Button
                                onPress={this._onClickWithdraw}
                                title="OK"
                                loading={this.state.loading}
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