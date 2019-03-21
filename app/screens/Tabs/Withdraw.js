import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import helpers
import {
    GET,
    setResponse
} from '../../Helpers';

// import api constants
import {
    API_URL,
    API_GET_WITHDRAW
} from '../../constants/api';

// import components
import Loading from '../../components/Loading';

class Withdraw extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            data: [],
            page: 0,
            loading: true,
            loadingMore: false,
            refreshing: false
        };
        // set limit render data
        this.limit = 10;
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
        const limit  = this.limit;
        const offset = this.state.page * limit;
        
        try {
            // request and get user withdraws
            const response = await GET(API_URL + API_GET_WITHDRAW, {
                payment_status: 1,
                offset,
                limit
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

    _handleLoadMore = () => {
        if(this.state.data.length >= this.limit) {
            this.setState({ loadingMore: true, page: this.state.page + 1 }, async () => {
                // fetch data
                const response = await this._fetchData();
    
                // state object
                let setStateData = {
                    loadingMore: false
                };
    
                if(response.status) {
                    if(response.data.length > 0) {
                        setStateData.data = [ ...this.state.data, ...response.data ];
                    }
                } else {
                    showToast(response.message);
                }
    
                // set state data
                this.setState(setStateData);
            });
        }
    }

    _handleRefresh = () => {
        this.setState({ loading: true, page: 0 }, async () => {
            // fetch data
            const response = await this._fetchData();

            // state object
            let setStateData = {
                refreshing: false,
                loading: false
            };

            if(response.status) {
                setStateData.data = response.data;
            } else {
                showToast(response.message);
            }

            // set state data
            this.setState(setStateData);
        });
    }

    _renderFooter = () => {
        if (!this.state.loadingMore) return null;
    
        return (
            <View style={{ marginBottom: 20 }}>
                <ActivityIndicator size="large" color="#474747" />
            </View>
        );
    }

    _renderEmpty = () => {
        return (
            <View>
                <Text style={{ textAlign: 'center' }}>Not Found</Text>
            </View>
        )
    }

    render() {
        return this.state.loading ? (
            <Loading/>
        ) : (
            <View style={styles.withdrawContainer}>
                <View>
                    <Text style={styles.withdrawText}>История всех платежей</Text>
                </View>
                <FlatList
                    style={{ marginTop: 20 }}
                    contentContainerStyle={styles.contentContainerStyle}
                    data={this.state.data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <View style={[ styles.item, { flex: 0.3 } ]}>
                                <Text style={styles.itemText}>{item.id}</Text>
                            </View>
                            <View style={[ styles.item, { flex: 1 } ]}>
                                <Text style={styles.itemText}>{
                                    item.payment_method == 1 ? 'Яндекс.деньги' :
                                    (item.payment_method == 2 ? 'Payeer' :
                                    (item.payment_method == 3 ? 'Webmoney' : 'Unknown'))
                                }</Text>
                                <Text style={styles.itemText}>{item.wallet_number}</Text>
                            </View>
                            <View style={[ styles.item, { flex: 1 } ]}>
                                <Text style={styles.itemText}>{
                                    item.payment_status == 0 ? 'в ожидании' :
                                    (item.payment_status == 1 ? 'оплаченный' :
                                    (item.payment_status == 2 ? 'не оплачено' : 'Unknown'))
                                }</Text>
                            </View>
                            <View style={[ styles.item, { flex: 0.5 } ]}>
                                <Text style={styles.itemText}>{item.amount.toFixed(2)} <Icon size={15} name="currency-rub" color="#474747"/></Text>
                            </View>
                        </View>
                    )}
                    onEndReached={this._handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshing={this.state.refreshing}
                    onRefresh={this._handleRefresh}
                    initialNumToRender={this.limit}
                    ListFooterComponent={this._renderFooter}
                    ListEmptyComponent={this._renderEmpty}
                />
            </View>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    contentContainerStyle: {
        flexDirection: 'column',
        width: '100%'
    },
    withdrawContainer: {
        flex: 1,
        paddingTop: 20
    },
    withdrawText: {
        color: '#979797',
        fontSize: 12,
        textAlign: 'center'
    },
    itemContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        alignContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 20
    },
    item: {
        alignContent: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    itemText: {
        textAlign: 'center',
        color: '#474747',
        fontSize: 13
    }
});

export default Withdraw;