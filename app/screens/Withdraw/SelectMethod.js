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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class SelectMethod extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            user: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let obj = {};
        if (prevState.user !== nextProps.userState) {
            obj.user = nextProps.userState;
        }
        return Object.keys(obj).length > 0 ? obj : null;
    }

    componentDidMount() {
        
    }

    onClickMethod = (method) => {
        this.props.onSetPaymentMethod(method, () => {
            this.props.onChangeScreen(2);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.title}>Выберите метод оплаты</Text>
                </View>
                <TouchableHighlight onPress={() => this.onClickMethod(1)} underlayColor="transparent">
                    <View style={styles.itemContainer}>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Image source={require('../../assets/yandex.png')} resizeMode="contain" style={styles.itemImg}/>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>0.5%</Text>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>5.00 <Icon size={15} name="currency-rub" color="#474747"/></Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onClickMethod(2)} underlayColor="transparent">                
                    <View style={styles.itemContainer}>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Image source={require('../../assets/payeer.png')} resizeMode="contain" style={styles.itemImg}/>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>0.95%</Text>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>5.00 <Icon size={15} name="currency-rub" color="#474747"/></Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.onClickMethod(3)} underlayColor="transparent">                
                    <View style={styles.itemContainer}>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Image source={require('../../assets/webmoney.png')} resizeMode="contain" style={styles.itemImg}/>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>0.8%</Text>
                        </View>
                        <View style={[ styles.item, { flex: 1 } ]}>
                            <Text style={styles.itemText}>5.00 <Icon size={15} name="currency-rub" color="#474747"/></Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

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