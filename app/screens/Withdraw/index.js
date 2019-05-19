import React, {
    Component
} from 'react';
import {
    BackHandler
} from 'react-native';

// import screens
import Main from './Main';
import Payment from './Payment';
import SelectMethod from './SelectMethod';

// import locales
import {
    translate
} from '../../locales';

class Withdraw extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            screenIndex: 0,
            methodData: {}
        };
    }

    static navigationOptions = ({
        navigation
    }) => {
        return {
            title: navigation.getParam('title', translate('c_withdraw_main_title')),
        };
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        let screenIndex = this.state.screenIndex;
        if (screenIndex > 0) {
            screenIndex--;
            this._onChangeScreen(screenIndex);
            return true;
        }
    }

    _onChangeScreen = (screenIndex) => {
        if (screenIndex == 0) {
            this.props.navigation.setParams({
                title: translate('c_withdraw_main_title')
            });
        } else if (screenIndex == 1) {
            this.props.navigation.setParams({
                title: translate('c_withdraw_payment_title')
            });
        } else if (screenIndex == 2) {
            this.props.navigation.setParams({
                title: this.state.methodData.method == 1 ? 'Яндекс.деньги' : (this.state.methodData.method == 2 ? 'Payeer' :
                    (this.state.methodData.method == 3 ? 'Webmoney' : 'Unknown'))
            });
        }
        this.setState({
            screenIndex
        });
    }

    _onSetPaymentMethod = (methodData, callback) => {
        this.setState({ methodData }, callback);
    }

    _renderScreen = () => {
        if(this.state.screenIndex == 0) {
            return <Main
                        onChangeScreen={this._onChangeScreen}
                        userState={this.props.userState}/>
        } else if(this.state.screenIndex == 1) {
            return <SelectMethod
                        onChangeScreen={this._onChangeScreen}
                        onSetPaymentMethod={this._onSetPaymentMethod}/>
        } else if(this.state.screenIndex == 2) {
            return <Payment
                        onChangeScreen={this._onChangeScreen}
                        withdrawState={this.state}
                        userState={this.props.userState}
                        userActions={this.props.userActions}/>
        }
    }

    render() {
        return this._renderScreen();
    }
}

export default Withdraw;