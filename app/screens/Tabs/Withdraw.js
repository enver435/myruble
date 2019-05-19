import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

// import components
import WithdrawList from '../../components/WithdrawList';

// import locales
import {
    translate
} from '../../locales';

class Withdraw extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.withdrawContainer}>
                <View>
                    <Text style={styles.withdrawText}>{translate('ctab_withdraw_title')}</Text>
                </View>
                <WithdrawList/>
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    withdrawContainer: {
        flex: 1,
        paddingTop: 20,
        flexDirection: 'column',
        backgroundColor: '#fafafa'
    },
    withdrawText: {
        color: '#979797',
        fontSize: 12,
        textAlign: 'center'
    }
});

export default Withdraw;