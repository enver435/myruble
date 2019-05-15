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
    setResponse,
    getStorage,
    showToast,
    timeToDate
} from '../Helpers';

// import api constants
import {
    API_GET_REFERRALS
} from '../constants/api';

// import components
import Loading from './Loading';

class ReferralList extends Component {
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
        // set mount
        this._isMounted = true;

        // fetch data
        const response = await this._fetchData();

        if (!response.status) {
            showToast(response.message);
        }

        if (this._isMounted) {
            // set state data
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
        const limit = this.limit;
        const offset = this.state.page * limit;

        try {
            // get phone storage user data
            const userData = await getStorage('userData');

            // create request data object
            let requestData = {
                user_id: userData.id,
                offset,
                limit
            };

            // request and get user withdraws
            const response = await GET(API_GET_REFERRALS, requestData);

            // return response
            return response;
        } catch (err) {
            // return response
            return setResponse({
                status: false,
                message: err.message
            });
        }
    }

    _handleLoadMore = () => {
        if (this.state.data.length >= this.limit) {
            this.setState({
                loadingMore: true,
                page: this.state.page + 1
            }, async () => {
                // fetch data
                const response = await this._fetchData();

                // state object
                let setStateData = {
                    loadingMore: false
                };

                if (response.status) {
                    if (response.data.length > 0) {
                        setStateData.data = [...this.state.data, ...response.data];
                    }
                } else {
                    showToast(response.message);
                }

                if (this._isMounted) {
                    // set state
                    this.setState(setStateData);
                }
            });
        }
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            loading: true,
            page: 0
        }, async () => {
            // fetch data
            const response = await this._fetchData();

            if (!response.status) {
                showToast(response.message);
            }

            if (this._isMounted) {
                // set state
                this.setState({
                    data: response.status ? response.data : [],
                    refreshing: false,
                    loading: false
                });
            }
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
            <View style={styles.notFoundContainer}>
                <Icon size={45} name="alert-circle-outline" color="#474747"/>
                <Text style={styles.notFoundText}>Результат не найден</Text>
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
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>{item.username}</Text>
                            <Text style={styles.itemText}>{item.user_id}</Text>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>{timeToDate(item.time)}</Text>
                        </View>
                        <View style={[ styles.item, { flex: 0.5 } ]}>
                            <Text style={styles.itemText}>{item.referral_percent}%</Text>
                        </View>
                        <View style={[ styles.item, { flex: 0.5 } ]}>
                            <Text style={styles.itemText}>{item.total_earn_referral.toFixed(3)} <Icon size={15} name="currency-rub" color="#474747"/></Text>
                        </View>
                    </View>
                )}
                onEndReached={this._handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                initialNumToRender={this.limit}
                ListFooterComponent={this._renderFooter}
                ListEmptyComponent={this._renderEmpty}
            />
        );
    }
}

// component styles
const styles = StyleSheet.create({
    contentContainerStyle: {
        flexDirection: 'column',
        width: '100%',
        flexGrow: 1
    },
    itemContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        alignContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 20,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
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

export default ReferralList;