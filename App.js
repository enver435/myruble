import React, {
    Component
} from 'react';
import {
    NetInfo,
    Alert,
    Linking,
    BackHandler,
    StatusBar
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

// import navigator
import AppNavigator from './app/AppNavigator';

// import helpers
import {
    GET,
    showToast
} from './app/Helpers';

// import components
import Offline from './app/components/Offline';
import AdMobBanner from './app/components/AdMobBanner';
import SplashScreen from './app/components/SplashScreen';

// import global theme
import Theme from './app/Theme';

class App extends Component {
    constructor(props) {
        super(props);

        // init state
        this.state = {
            isConnected: true,
            showApp: false,
            splash: true,
            data: {}
        };

        // app url
        this.appUrl = 'https://play.google.com/store/apps/details?id=com.myruble';
    }

    async componentDidMount() {
        // set mount
        this._isMounted = true;

        // app starting
        await this._appStart();

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

    _appStart = async () => {
        // check network
        const isConnected = await NetInfo.isConnected.fetch();
        this.setState({
            isConnected
        });

        // if network is connected
        if (isConnected) {
            // fetch app data from api
            await this._fetchData();

            // if application status enable
            if (this.state.data.appStatus == "true") {
                // check app version
                await this._checkAppVersion();

                // splash screen display hide
                await this._splashHide();
            } else {
                // show alert
                Alert.alert(
                    'myRuble не работает временно',
                    'myRuble не работает временно. Ремонтные работы продолжаются. Пожалуйста, попробуйте позже.',
                    [
                        // {
                        //     text: 'Позже',
                        //     onPress: () => {
                        //         // show app
                        //         this.setState({ showApp: true });
                        //     }
                        // },
                        {
                            text: 'OK',
                            onPress: () => {
                                // exit app
                                BackHandler.exitApp();
                                return true;
                            }
                        },
                    ], {
                        cancelable: false
                    },
                );
            }
        }
    }

    _fetchData = async () => {
        try {
            const response = await GET();
            if(response.status) {
                if (this._isMounted) {
                    this.setState({
                        data: response.data
                    });
                }
            }
        } catch (err) {
            showToast(err.message);
        }
    }

    _checkAppVersion = async () => {
        try {
            const appDeviceVersion = DeviceInfo.getVersion();
            if (this.state.data.appVersion != appDeviceVersion) {
                // show alert
                Alert.alert(
                    'Новая версия: ' + this.state.data.appVersion,
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
                this.setState({
                    showApp: true
                });
            }
        } catch (err) {
            showToast(err.message);
        }
    }

    _splashHide = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => {
                    resolve('splash screen display hide')
                    this.setState({
                        splash: false
                    });
                },
                2000
            )
        )
    }

    render() {
        return(
            <ThemeProvider theme={Theme}>
                <StatusBar barStyle="default" backgroundColor="#474747" animated={true} />
                {this.state.isConnected ? (
                    this.state.showApp && !this.state.splash ? (
                        <Provider store={store}>
                            <AppNavigator/>
                            <AdMobBanner/>
                        </Provider>
                    ) : <SplashScreen/>
                ) : <Offline checkNetwork={this._appStart}/>}
            </ThemeProvider>
        )
    }
}

export default App;