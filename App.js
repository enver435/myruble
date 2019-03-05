import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import { Provider } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { ThemeProvider } from 'react-native-elements';

// import store
import store from './app/store';

// import app navigation
import AppNavigator from './app/AppNavigator';

// import helpers
import {
    getStorage,
    setStorage,
    showToast
} from './app/Helpers';

// import components
import Offline from './app/components/Offline';

// import global theme
import Theme from './app/Theme';

class App extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            isConnected: true
        };
    }

    componentDidMount() {
        // set mount
        this._isMounted = true;
        // check network
        this.checkNetwork();
        // update app version
        this.updateAppVersion();
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    checkNetwork = () => {
        NetInfo.isConnected.fetch().then(isConnected => {
            if(this._isMounted) {
                this.setState({ isConnected });
            }
        });
    }

    updateAppVersion = async () => {
        const appVersion = DeviceInfo.getVersion();
        try {
            const storageAppVersion = await getStorage('appVersion');
            if (storageAppVersion != appVersion) {
                await setStorage('appVersion', appVersion);
            }
        } catch (err) {
            showToast(err.message);
        }
    }

    render() {
        return(
            <ThemeProvider theme={Theme}>
                {this.state.isConnected ? (
                    <Provider store={store}>
                        <AppNavigator/>
                    </Provider>
                ) : <Offline checkNetwork={this.checkNetwork}/>}
            </ThemeProvider>
        )
    }
}

export default App;