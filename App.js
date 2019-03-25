import React, {
    Component
} from 'react';
import {
    NetInfo,
    Alert,
    Linking,
    View
} from 'react-native';
import {
    Provider
} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {
    ThemeProvider
} from 'react-native-elements';
import firebase from 'react-native-firebase';

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

class App extends Component {
    constructor(props) {
        super(props);

        // init state
        this.state = {
            isConnected: true,
            showApp: false
        };
        
        // app url
        this.appUrl = 'https://play.google.com/store/apps/details?id=com.myruble';
    }

    async componentDidMount() {
        // set mount
        this._isMounted = true;

        // check network
        this.checkNetwork().then(() => {
            if(this.state.isConnected) {
                // check app version
                this.appNewVersionCheck();
            }
        });

        // firebaseMessagingPermission
        const hasPermission = await firebase.messaging().hasPermission();
        if (!hasPermission) {
            try {
                await firebase.messaging().requestPermission();
            } catch (err) {
                showToast(err.message);
            }
        }

        // notificationListener
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            notification.setSound('default')
                .android.setChannelId('myruble_channel')
                .android.setSmallIcon('ic_launcher')
                .android.setLargeIcon('ic_launcher')
                .android.setPriority(firebase.notifications.Android.Priority.Max)
            
            firebase.notifications().displayNotification(notification);
        });
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;

        // notificationListener
        this.notificationListener();
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
            const response         = await POST(API_URL);
            const appDeviceVersion = DeviceInfo.getVersion();

            if (response.data.appVersion != appDeviceVersion) {
                // show alert
                Alert.alert(
                    'Новая версия: ' + response.data.appVersion,
                    'Если вы не обновите приложение, оно может работать неправильно. Хотите обновить?',
                    [
                    // {
                    //         text: 'Позже',
                    //         onPress: () => {
                    //             // show app
                    //             this.setState({ showApp: true });
                    //         }
                    //     },
                        {
                            text: 'Обновить',
                            onPress: () => {
                                // configration play market URL
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
            } else {
                this.setState({ showApp: true });
            }
        } catch (err) {
            showToast(err.message);
        }
    }

    render() {
        return(
            <ThemeProvider theme={Theme}>
                {this.state.isConnected ? (
                    this.state.showApp ? (
                        <Provider store={store}>
                            <AppNavigator/>
                            <AdMobBanner/>
                        </Provider>
                    ) : <View/>
                ) : <Offline checkNetwork={this.checkNetwork}/>}
            </ThemeProvider>
        )
    }
}

export default App;