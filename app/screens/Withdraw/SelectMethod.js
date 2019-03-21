import React, {
    Component
} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import helpers
import {
    GET,
    setResponse
} from '../../Helpers';

// import api constants
import {
    API_URL,
    API_GET_WITHDRAW_METHODS
} from '../../constants/api';

// import components
import Loading from '../../components/Loading';

class SelectMethod extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: true,
            data: {}
        };
    }

    async componentDidMount() {
        // fetch data
        const response = await this._fetchData();

        // state object
        let setStateData = {
            loading: false
        };

        if(response.status) {
            setStateData.data = response.data;
        } else {
            showToast(response.message);
        }

        // set state data
        this.setState(setStateData);
    }

    _fetchData = async () => {
        try {
            // request
            const response = await GET(API_URL + API_GET_WITHDRAW_METHODS);
            // return response
            return setResponse(response.data);
        } catch (err) {
            return setResponse({
                status: false,
                message: err.message
            });
        }
    }

    onClickMethod = (method, commission, min_withdraw) => {
        const data = {
            method,
            min_withdraw,
            commission
        };
        this.props.onSetPaymentMethod(data, () => {
            this.props.onChangeScreen(2);
        });
    }

    render() {
        return this.state.loading ? (
            <Loading/>
        ) : (
            <View style={styles.container}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.title}>Выберите метод оплаты</Text>
                </View>
                <TouchableHighlight
                    onPress={() => {
                        this.onClickMethod(1, this.state.data.yandex_commission, this.state.data.yandex_min_withdraw)}
                    }
                    underlayColor="transparent">
                    <View style={styles.itemContainer}>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Image source={require('../../assets/yandex.png')} resizeMode="contain" style={styles.itemImg}/>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>{this.state.data.yandex_commission.toFixed(2)}%</Text>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>{this.state.data.yandex_min_withdraw.toFixed(2)} <Icon size={15} name="currency-rub" color="#474747"/></Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => {
                        this.onClickMethod(2, this.state.data.payeer_commission, this.state.data.payeer_min_withdraw)}
                    }
                    underlayColor="transparent">
                    <View style={styles.itemContainer}>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Image source={require('../../assets/payeer.png')} resizeMode="contain" style={styles.itemImg}/>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>{this.state.data.payeer_commission.toFixed(2)}%</Text>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>{this.state.data.payeer_min_withdraw.toFixed(2)} <Icon size={15} name="currency-rub" color="#474747"/></Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight 
                    onPress={() => {
                        this.onClickMethod(3, this.state.data.webmoney_commission, this.state.data.webmoney_min_withdraw)}
                    }
                    underlayColor="transparent">             
                    <View style={styles.itemContainer}>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Image source={require('../../assets/webmoney.png')} resizeMode="contain" style={styles.itemImg}/>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>{this.state.data.webmoney_commission.toFixed(2)}%</Text>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>{this.state.data.webmoney_min_withdraw.toFixed(2)} <Icon size={15} name="currency-rub" color="#474747"/></Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

// component prop types
SelectMethod.propTypes = {
    onChangeScreen: PropTypes.func.isRequired,
    onSetPaymentMethod: PropTypes.func.isRequired
};

// component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        flexDirection: 'column',
        backgroundColor: '#fafafa'
    },
    title: {
        color: '#979797',
        fontSize: 12,
        textAlign: 'center'
    },
    itemContainer: {
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 20
    },
    item: {
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    itemText: {
        textAlign: 'center',
        color: '#474747',
        fontSize: 13
    },
    itemImg: {
        width: 110,
        height: 45
    }
});

export default SelectMethod;