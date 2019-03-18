import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class WithdrawItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const commissionCalc = this.props.item.commission * this.props.item.amount / 100;
        return (
            <View style={styles.itemContainer}>
                <View style={{ flex: 0.3 }}>
                    <Text>{this.props.item.id}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{
                        this.props.item.payment_method == 1 ? 'Яндекс.деньги' :
                        (this.props.item.payment_method == 2 ? 'Payeer' :
                        (this.props.item.payment_method == 3 ? 'Webmoney' : 'Unknown'))
                    }</Text>
                    <Text>{this.props.item.wallet_number}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{
                        this.props.item.payment_status == 0 ? 'в ожидании' :
                        (this.props.item.payment_status == 1 ? 'оплаченный' :
                        (this.props.item.payment_status == 2 ? 'не оплачено' : 'Unknown'))
                    }</Text>
                </View>
                <View style={{ flex: 0.5 }}>
                    <Text>{(this.props.item.amount - commissionCalc).toFixed(2)} <Icon size={15} name="currency-rub" color="#474747"/></Text>
                </View>
            </View>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    }
});

export default WithdrawItem;