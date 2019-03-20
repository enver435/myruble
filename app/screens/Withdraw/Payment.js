import React, {
    Component
} from 'react';
import {
    View,
    Image,
    Dimensions,
    TextInput,
    ScrollView,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation'

// import helpers
import {
    POST,
    setResponse,
    showToast,
    getStorage
} from '../../Helpers';

// import api constants
import {
    API_URL,
    API_INSERT_WITHDRAW,
    API_CHECK_WAITING_WITHDRAW
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
            if(await getStorage('userData')) {
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

    _checkWaiting = async () => {
        try {
            const userData = await getStorage('userData');
            if(userData) {
                const response = await POST(API_URL + API_CHECK_WAITING_WITHDRAW, {
                    user_id: userData.id
                });
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
            // get phone storage user data
            const userData = await getStorage('userData');
            
            // get payment method information
            const { method, commission, min_withdraw } = this.props.withdrawState.payment;

            // insert status
            let insertStatus = false;

            if(this.state.amount < min_withdraw) {
                showToast('Можно снять как минимум ' + min_withdraw.toFixed(2) + ' рублей');
            } else if(this.state.amount > userData.balance) {
                showToast('Ваш баланс не хватает');
            } else {
                const resCheckWaiting = await this._checkWaiting();
                if(resCheckWaiting.status) {
                    if(resCheckWaiting.data) {
                        showToast('Ваш недавний запрос на вывод средств не был выполнен. Пожалуйста, повторите попытку позже.');
                    } else {
                        insertStatus = true;
                    }
                } else {
                    showToast(resCheckWaiting.message);
                }
            }

            // if insert status true
            if(insertStatus) {
                // create insert data
                const data = {
                    user_id: userData.id,
                    amount: this.state.amount,
                    commission,
                    payment_method: method,
                    wallet_number: this.state.wallet_number,
                    payment_status: 0,
                    time: Math.round(new Date().getTime() / 1000)
                };
                
                // request insert data
                const response = await this._insertData(data);
                if(response.status) {
                    showToast('Ваш запрос был успешно отправлен. Это будет сделано в течение 24 часов.');
                    // navigate main screen
                    this.props.navigation.navigate('Main');
                } else {
                    showToast(response.message);
                }
            }

            if(this._isMounted) {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
                    <View>
                        <View style={styles.imgContainer}>
                            {this.state.methodName == 'yandex' ? (
                                <Image source={require('../../assets/yandex.png')} resizeMode="contain" style={styles.paymentImg}/>
                            ) : (this.state.methodName == 'payeer' ? (
                                <Image source={require('../../assets/payeer.png')} resizeMode="contain" style={styles.paymentImg}/>
                            ) : (this.state.methodName == 'webmoney' ? (
                                <Image source={require('../../assets/webmoney.png')} resizeMode="contain" style={styles.paymentImg}/>
                            ): null))}
                        </View>
                        <View>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="#474747"
                                returnKeyType="next"
                                placeholder={this.state.methodName.charAt(0).toUpperCase() + this.state.methodName.slice(1) + ' Кошелек ID'}
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
                                onChangeText={(amount) => this.setState({ amount })}
                            />
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
    userState: PropTypes.object.isRequired
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