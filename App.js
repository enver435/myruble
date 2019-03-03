import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import DeviceInfo from 'react-native-device-info';

import AppNavigator from './app/AppNavigator';

// import store
import store from './app/store';

class App extends Component {
    componentDidMount() {
        this.updateAppVersion();
    }

    updateAppVersion = async () => {
        const appVersion = DeviceInfo.getVersion();
        try {
            const storageAppVersion = await AsyncStorage.getItem('appVersion');
            if(storageAppVersion != appVersion) {
                await AsyncStorage.setItem('appVersion', appVersion);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    render() {
        return(
            <Provider store={store}>
                <AppNavigator/>
                <FlashMessage position="bottom"/>
            </Provider>
        )
    }
}

export default App;
