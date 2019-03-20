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
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import components
import Loading from '../components/Loading';

class WithdrawList extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            data: [],
            page: 0,
            loading: true,
            loadingMore: false,
            refreshing: false,
            error: null
        };
        // set limit render data
        this.limit = 10;
    }

    async componentDidMount() {
        // reset data
        await this.props.actions.reset();

        // fetch data
        const response = await this._fetchData();

        if(response.status) {
            this.setState({
                data: response.data,
                loading: false
            });
        } else {
            this.setState({
                error: response.message,
                loading: false
            });
        }
    }

    _fetchData = async () => {
        const offset = this.state.page * this.limit;
        // fetch data
        if(this.props.user) {
            return await this.props.actions.getUserWithdraws(offset, this.limit);
        }
        return await this.props.actions.getAllWithdraws(offset, this.limit);
    }

    _handleLoadMore = () => {
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
                setStateData.error = response.message;
            }

            // set state data
            this.setState(setStateData);
        })
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
                // reset data
                this.props.actions.reset();
            } else {
                setStateData.error = response.message;
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
                            <Text style={styles.itemText}>{(item.amount - (item.commission * item.amount / 100)).toFixed(2)} <Icon size={15} name="currency-rub" color="#474747"/></Text>
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
        );
    }
}

// component prop types
WithdrawList.propTypes = {
    actions: PropTypes.object.isRequired,
    user: PropTypes.bool
};

// component default props
WithdrawList.defaultProps = {
    user: false
};

// component styles
const styles = StyleSheet.create({
    contentContainerStyle: {
        flexDirection: 'column',
        width: '100%'
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

export default WithdrawList;