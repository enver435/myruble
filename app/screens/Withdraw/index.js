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

class Withdraw extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            screenIndex: 0
        };
    }

    static navigationOptions = ({
        navigation
    }) => {
        return {
            title: navigation.getParam('title', 'Получить деньги'),
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
            this.onChangeScreen(screenIndex);
            return true;
        }
    }

    _onChangeScreen = (screenIndex) => {
        if (screenIndex == 0) {
            this.props.navigation.setParams({
                title: 'Получить деньги'
            });
        } else if (screenIndex == 1) {
            this.props.navigation.setParams({
                title: 'Способ оплаты'
            });
        } else if (screenIndex == 2) {
            this.props.navigation.setParams({
                title: 'Payment'
            });
        }
        this.setState({
            screenIndex
        });
    }

    _renderScreen = () => {
        if(this.state.screenIndex == 0) {
            return <Main
                        onChangeScreen={this._onChangeScreen}
                        userState={this.props.userState}
                        withdrawActions={this.props.withdrawActions}/>
        } else if(this.state.screenIndex == 1) {
            return <SelectMethod
                        onChangeScreen={this._onChangeScreen}
                        userState={this.props.userState}/>
        } else if(this.state.screenIndex == 2) {
            return <Payment
                        onChangeScreen={this._onChangeScreen}
                        userState={this.props.userState}/>
        }
    }
    
    render() {
        return this._renderScreen();
    }
}

export default Withdraw;