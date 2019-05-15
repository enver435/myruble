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
    GET,
    setResponse,
    showToast,
    timeToDate
} from '../Helpers';

// import api constants
import {
    API_ACTIVE_PRIZE
} from '../constants/api';

// import components
import Loading from '../components/Loading';

class PrizeReferral extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            refreshing: false,
            loading: true,
            priceInfo: {},
            prizeRefs: []
        };
    }

    static navigationOptions = () => {
        return {
            title: 'Реферальный приз'
        };
    };

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
                prizeInfo: response.status ? response.data.prizeInfo : this.state.prizeInfo,
                prizeRefs: response.status ? response.data.prizeRefs : [],
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
            const response = await GET(API_ACTIVE_PRIZE);
            // return response
            return response;
        } catch (err) {
            return setResponse({
                status: false,
                message: err.message
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
                    prizeInfo: response.status ? response.data.prizeInfo : this.state.prizeInfo,
                    prizeRefs: response.status ? response.data.prizeRefs : [],
                    refreshing: false
                });
            }
        });
    }

    render() {
        return this.state.loading ? <Loading/> : (
            <View style={styles.container}>
                {Object.keys(this.state.prizeInfo).length == 0 ? (
                    <View style={styles.notFoundContainer}>
                        <Icon size={45} name="alert-circle-outline" color="#474747"/>
                        <Text style={styles.notFoundText}>Приз не найден</Text>
                    </View>
                ) : (
                    <ScrollView
                        style={{ flex: 1, height: '100%' }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                        contentContainerStyle={{flexGrow: 1}}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}><Text style={{ color: '#d10000' }}>1nd</Text> приз</Text>
                            <Text style={[styles.headerText, { fontSize: 30, color: '#474747' }]}>{this.state.prizeInfo.amount} <Icon size={30} name="currency-rub" color="#474747" /></Text>
                            <Text style={styles.headerText}>{timeToDate(this.state.prizeInfo.start_time, false)} - {timeToDate(this.state.prizeInfo.end_time, false)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                style={{ flex: 1, height: '100%' }}
                                contentContainerStyle={{flexGrow: 1}}>
                                {this.state.prizeRefs.length > 0 ? (
                                    this.state.prizeRefs.map((item, indx) => {
                                        return <View key={indx} style={styles.itemContainer}>
                                            <View style={[ styles.item, { flex: 0.5 } ]}>
                                                <Text style={styles.itemText}>{indx+1}</Text>
                                            </View>
                                            <View style={[ styles.item, { flex: 1 } ]}>
                                                <Text style={styles.itemText}>{item.referral_code}</Text>
                                            </View>
                                            <View style={[ styles.item, { flex: 1 } ]}>
                                                <Text style={styles.itemText}>{item.username}</Text>
                                            </View>
                                            <View style={[ styles.item, { flex: 1, flexDirection: 'row' } ]}>
                                                <Icon size={20} name="account" color="#474747"/>
                                                <Text style={[styles.itemText, { marginLeft: 5 }]}>{item.total_ref_count}</Text>
                                            </View>
                                        </View>
                                    })
                                ) : (
                                    <View style={styles.notFoundContainer}>
                                        <Icon size={45} name="alert-circle-outline" color="#474747"/>
                                        <Text style={styles.notFoundText}>Результат не найден</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </ScrollView>
                )}
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        backgroundColor: '#fafafa',
        paddingTop: 20
    },
    header: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 15,
        marginBottom: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 5
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
        marginBottom: 20,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
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

export default PrizeReferral;