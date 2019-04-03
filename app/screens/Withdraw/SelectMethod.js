import React, {
    Component
} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import helpers
import {
    GET,
    setResponse,
    showToast
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
            refreshing: false,
            data: []
        };
    }

    async componentDidMount() {
        // set mount
        this._isMounted = true;

        // fetch payment methods
        const response = await this._fetchData();
    
        if (!response.status) {
            showToast(response.message);
        }

        // set state
        if(this._isMounted) {
            this.setState({
                data: response.status ? response.data : [],
                loading: false
            });
        }
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    _fetchData = async () => {
        try {
            // request
            const response = await GET(API_URL + API_GET_WITHDRAW_METHODS);
            // return response
            return response;
        } catch (err) {
            return setResponse({
                status: false,
                message: err.message
            });
        }
    }

    _onClickMethod = (method) => {
        const data = this.state.data.filter((item) => {
            return item.method == method
        });
        if (data.length > 0) {
            this.props.onSetPaymentMethod(data[0], () => {
                this.props.onChangeScreen(2);
            });
        }
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true
        }, async () => {
            // fetch payment methods
            const response = await this._fetchData();

            if(!response.status) {
                showToast(response.message);
            }

            // set state
            if(this._isMounted) {
                this.setState({
                    data: response.status ? response.data : [],
                    refreshing: false
                });
            }
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
                <ScrollView
                    style={{ flex: 1, height: '100%' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    contentContainerStyle={{flexGrow: 1}}>
                    {this.state.data.length > 0 ? (
                        this.state.data.map((item) => {
                            return item.status ? (<TouchableHighlight
                                key={item.id}
                                onPress={() => { this._onClickMethod(item.method) }}
                                underlayColor="transparent">
                                <View style={styles.itemContainer}>
                                    <View style={[ styles.item, { flex: 1 } ]}>
                                        <Image source={item.method == 1 ? require('../../assets/yandex.png') : (item.method == 2 ? require('../../assets/payeer.png') : (item.method == 3 ? require('../../assets/webmoney.png') : null))} resizeMode="contain" style={styles.itemImg}/>
                                    </View>
                                    <View style={[ styles.item, { flex: 1 } ]}>
                                        <Text style={styles.itemText}>{item.commission.toFixed(2)}%</Text>
                                    </View>
                                    <View style={[ styles.item, { flex: 1 } ]}>
                                        <Text style={styles.itemText}>{item.min_withdraw.toFixed(2)} <Icon size={15} name="currency-rub" color="#474747"/></Text>
                                    </View>
                                </View>
                            </TouchableHighlight>) : null
                        })
                    ) : (
                        <View style={styles.notFoundContainer}>
                            <Icon size={45} name="alert-circle-outline" color="#474747"/>
                            <Text style={styles.notFoundText}>Результат не найден</Text>
                        </View>
                    )}
                </ScrollView>
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
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: '100%'
    },
    notFoundText: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#474747'
    }
});

export default SelectMethod;