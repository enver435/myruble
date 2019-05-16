import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Picker,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class ReferralCalculator extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            referralCount: 100,
            gameCount: 100,
            level: 2,
            calcRes: 0,
            game: {}
        };
    }

    static navigationOptions = () => {
        return {
            title: 'Прибыль pеферал калькулятор'
        };
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let obj = {};
        if (prevState.game !== nextProps.gameState) {
            obj.game = nextProps.gameState;
        }
        return Object.keys(obj).length > 0 ? obj : null;
    }

    componentDidMount() {
        // set mount
        this._isMounted = true;
        this._calculator();
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    _calculator = () => {
        const levelData = this.state.game.levels.filter((item) => {
            return item.level === this.state.level;
        });
        const calc = ((this.state.referralCount * this.state.gameCount) * (levelData[0].earn * levelData[0].referral_percent / 100)) * 7; // weekly
        this.setState({
            calcRes: calc
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.calcContainer}>
                    <ScrollView>
                        <View style={styles.textInput}>
                            <Text>Pеферал</Text>
                            <TextInput
                                underlineColorAndroid="#474747"
                                keyboardType="numeric"
                                returnKeyType="next"
                                value={this.state.referralCount.toString()}
                                onChangeText={(referralCount) => this.setState({ referralCount: referralCount ? parseInt(referralCount) : 0 }, this._calculator)}
                            />
                        </View>
                        <View style={styles.textInput}>
                            <Text>Игра</Text>
                            <TextInput
                                underlineColorAndroid="#474747"
                                keyboardType="numeric"
                                returnKeyType="next"
                                value={this.state.gameCount.toString()}
                                onChangeText={(gameCount) => this.setState({ gameCount: gameCount ? parseInt(gameCount) : 0 }, this._calculator)}
                            />
                        </View>
                        <View style={styles.textInput}>
                            <Text>Уровень</Text>
                            <Picker
                                selectedValue={this.state.level}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({level: itemValue}, this._calculator)
                                }
                                mode="dropdown">
                                {this.state.game.levels.map(item => {
                                    return <Picker.Item key={item.level} label={`${item.level} Уровень`} value={item.level} />
                                })}
                            </Picker>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.calcResult}>
                    <Text style={styles.calcResText}>
                        <Text style={{ fontWeight: 'bold' }}>{(Math.round(this.state.calcRes * 100) / 100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text> <Icon size={25} name="currency-rub" color="#474747" /> неделя
                    </Text>
                </View>
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
    calcContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 25,
        paddingBottom: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    textInput: {
        marginBottom: 10
    },
    calcResult: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    calcResText: {
        fontSize: 25,
        color: '#474747'
    }
});

export default ReferralCalculator;