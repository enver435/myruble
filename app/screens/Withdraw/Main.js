import React, {
    Component
} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import components
import WithdrawItem from '../../components/WithdrawItem';
import Loading from '../../components/Loading';

class Main extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: true,
            user: {},
            withdraws: []
        };
    }

    componentDidMount() {
        this.props.withdrawActions.getUserWithdraws().then((response) => {
            this.setState({ loading: false });
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let obj = {};
        if (prevState.user !== nextProps.userState) {
            obj.user = nextProps.userState;
        }
        if (prevState.withdraws !== nextProps.withdrawsState.user) {
            obj.withdraws = nextProps.withdrawsState.user;
        }
        return Object.keys(obj).length > 0 ? obj : null;
    }

    render() {
        const { balance } = this.state.user.data;
        return this.state.loading ? (
            <Loading/>
        ) : (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={{ flex: 1 }}>
					    <Text style={styles.balanceText}>{balance.toFixed(2)} <Icon size={35} name="currency-rub" color="#474747"/></Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button
                            onPress={() => { this.props.onChangeScreen(1) }}
                            title="Получить"
                            containerStyle={{ marginTop: 5 }}
                        />
                    </View>
                </View>
                <View style={styles.withdrawContainer}>
                    {this.state.withdraws.length > 0 ? (
                        <View>
                            <View>
                                <Text style={styles.withdrawText}>История платежей</Text>
                            </View>
                            <View>
                                {this.state.withdraws.map((item) => {
                                    return <WithdrawItem key={item.id} item={item}/>
                                })}
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text style={{ textAlign: 'center' }}>Not Found</Text>
                        </View>
                    )}
                </View>
            </View>
        )
    }
}

// component prop types
Main.propTypes = {
    userState: PropTypes.object.isRequired,
    onChangeScreen: PropTypes.func.isRequired
};

// component styles
const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flexDirection: 'column',
        backgroundColor: '#fafafa'
    },
    headerContainer: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc',
        paddingBottom: 20
    },
	balanceText: {
		fontSize: 35,
		color: '#474747'
	},
    withdrawContainer: {
        paddingTop: 20
    },
    withdrawText: {
        color: '#979797',
        fontSize: 12,
        textAlign: 'center'
    }
});

export default Main;