import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';

// import components
import UserWithdrawList from '../../components/UserWithdrawList';

class Main extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {};
    }

    render() {
        const { balance } = this.props.userState.data;
        return (
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
                    <View>
                        <Text style={styles.withdrawText}>История платежей</Text>
                    </View>
                    <UserWithdrawList/>
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
        flex: 1,
        paddingTop: 20,
        flexDirection: 'column',
        backgroundColor: '#fafafa'
    },
    headerContainer: {
        flex: 0,
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
        flex: 1,
        paddingTop: 20
    },
    withdrawText: {
        color: '#979797',
        fontSize: 12,
        textAlign: 'center'
    }
});

export default Main;