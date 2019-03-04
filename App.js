import React, {
    Component
} from 'react';
import {
    AsyncStorage,
    NetInfo
} from 'react-native';
import {
    Provider
} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import DeviceInfo from 'react-native-device-info';

// import app navigation
import AppNavigator from './app/AppNavigator';

// import store
import store from './app/store';

// import components
import Offline from './app/components/Offline';

class App extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            isConnected: true
        };
    }

    componentDidMount() {
        this.checkNetwork();
        this.updateAppVersion();
    }

    checkNetwork = () => {
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({ isConnected });
        });
    }

    updateAppVersion = async () => {
        const appVersion = DeviceInfo.getVersion();
        try {
            const storageAppVersion = await AsyncStorage.getItem('appVersion');
            if (storageAppVersion != appVersion) {
                await AsyncStorage.setItem('appVersion', appVersion);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    render() {
        return(
            this.state.isConnected ? (
                <Provider store={store}>
                    <AppNavigator/>
                    <FlashMessage position="bottom"/>
                </Provider>
            ) : <Offline checkNetwork={this.checkNetwork}/>
        )
    }
}

export default App;