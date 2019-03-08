import React, {
    Component
} from 'react';
import {
    NetInfo,
    Alert,
    Linking
} from 'react-native';
import {
    Provider
} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {
    ThemeProvider
} from 'react-native-elements';
import BackgroundJob from 'react-native-background-job';

// import store
import store from './app/store';

// import app navigation
import AppNavigator from './app/AppNavigator';

// import helpers
import {
    POST,
    showToast
} from './app/Helpers';

// import api constants
import { API_URL } from './app/constants/api';

// import components
import Offline from './app/components/Offline';
import AdMobBanner from './app/components/AdMobBanner';

// import global theme
import Theme from './app/Theme';

// import tasks
import NotifyTask from './app/NotifyTask';

class App extends Component {
    constructor(props) {
        super(props);

        // init state
        this.state = {
            isConnected: true
        };
        
        // app url
        this.appUrl = 'https://play.google.com/store/apps/details?id=com.myruble';

        // register background notify task
        this.registerNotifyTask();
    }

    componentDidMount() {
        // set mount
        this._isMounted = true;

        // check network
        this.checkNetwork().then(() => {
            if(this.state.isConnected) {
                // check app version
                this.appNewVersionCheck();
            }
        });
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    checkNetwork = async () => {
        try {
            const isConnected = await NetInfo.isConnected.fetch();
            if (this._isMounted) {
                this.setState({
                    isConnected
                });
            }
        } catch (err) {
            showToast(err.message);
        }
    }

    appNewVersionCheck = async () => {
        try {
            const response = await POST(API_URL);
            const appDeviceVersion = DeviceInfo.getVersion();
            if (response.data.appVersion != appDeviceVersion) {
                Alert.alert(
                    'Новая версия: ' + response.data.appVersion,
                    'Если вы не обновите приложение, оно может работать неправильно. Хотите обновить?',
                    [{
                            text: 'Позже',
                            onPress: () => console.log('Позже')
                        },
                        {
                            text: 'Обновить',
                            onPress: () => {
                                Linking.canOpenURL(this.appUrl).then(supported => {
                                    if (supported) {
                                        Linking.openURL(this.appUrl);
                                    } else {
                                        showToast("Don't know how to open URI: " + this.appUrl);
                                    }
                                });
                            }
                        },
                    ], {
                        cancelable: false
                    },
                );
            }
        } catch (err) {
            showToast(err.message);
        }
    }

    registerNotifyTask = async () => {
        // register task
        BackgroundJob.register({
            jobKey: "NotifyTask",
            job: NotifyTask
        });
        
        // schedule task
        BackgroundJob.schedule({
            jobKey: "NotifyTask",
            job: NotifyTask,
            // period: 100,
            // timeout: 10000,
            exact: true,
            allowExecutionInForeground: true
        });
    }

    cancelNotifyTask = () => {
        BackgroundJob.cancel({
            jobKey: 'NotifyTask'
        });
    }

    render() {
        return(
            <ThemeProvider theme={Theme}>
                {this.state.isConnected ? (
                    <Provider store={store}>
                        <AppNavigator/>
                        <AdMobBanner/>
                    </Provider>
                ) : <Offline checkNetwork={this.checkNetwork}/>}
            </ThemeProvider>
        )
    }
}

export default App;