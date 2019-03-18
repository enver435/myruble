import React, {
    Component
} from 'react';
import {
    View,
    Text,
    BackHandler
} from 'react-native';

// import screens
import Main from './Main';
import Payment from './Payment';
import SelectMethod from './SelectMethod';

class Withdraw extends Component {
    constructor(props) {
        super(props);
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

    onChangeScreen = (screenIndex) => {
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

    renderScreen = () => {
        if(this.state.screenIndex == 0) {
            return <Main
                        onChangeScreen={this.onChangeScreen}
                        userState={this.props.userState}
                        withdrawsState={this.props.withdrawsState}
                        withdrawActions={this.props.withdrawActions}/>
        } else if(this.state.screenIndex == 1) {
            return <SelectMethod
                        onChangeScreen={this.onChangeScreen}
                        userState={this.props.userState}/>
        } else if(this.state.screenIndex == 2) {
            return <Payment
                        onChangeScreen={this.onChangeScreen}
                        userState={this.props.userState}/>
        }
    }
    
    render() {
        return this.renderScreen()
    }
}

export default Withdraw;