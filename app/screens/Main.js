import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Alert
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

// import helpers
import {
    showToast,
    getStorage,
    setStorage,
    getFirebaseToken
} from '../Helpers';

// import components
import Header from '../components/Header';
import Loading from '../components/Loading';

// import containers
import Tabs from '../Tabs';

// import locales
import {
    translate
} from '../locales';

class Home extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: true
        };
    }

    static navigationOptions = {
        header: null
    }

    async componentDidMount() {
        // set mount
        this._isMounted = true;

        // set focus listener
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.setState({
                loading: true
            }, async () => {
                /**
                 * Get User
                 */
                const userRes = await this.props.userActions.get();
                if (userRes.status) {
                    const userData = await getStorage('userData');
                    const firebaseToken = await getFirebaseToken();
                    const macAddress = await DeviceInfo.getMACAddress();
                    const timeZone = await DeviceInfo.getTimezone();
                    const deviceId = await DeviceInfo.getUniqueID();
                    // update user
                    if (userData && (
                        userData.firebase_token != firebaseToken ||
                        userData.timezone != timeZone ||
                        userData.device_id != deviceId
                    )) {
                        await this.props.userActions.update({
                            firebase_token: firebaseToken,
                            mac_address: macAddress,
                            timezone: timeZone,
                            device_id: deviceId
                        });
                    }
                } else {
                    // show error message
                    if (userRes.message != 'Error: Not auth!') {
                        showToast(userRes.message);
                    }
                }
    
                /**
                 * Get Default Game Information
                 */
                if (userRes.status) {
                    const levelRes = await this.props.gameActions.getLevels();
                    if (levelRes.status) {
                        await this.props.gameActions.getLevelData(userRes.data.level);
                    } else {
                        // show error message
                        showToast(levelRes.message);
                    }
                }
    
                // hide loading
                if (this._isMounted) {
                    this.setState({
                        loading: false
                    });
                }
            });
        });
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;

        // remove focus listener
        this.focusListener.remove();
    }

    render() {
        return this.state.loading === true ? (
            <Loading/>
        ) : (
            <View style={styles.container}>
                <Header/>
                <Tabs/>
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    }
});

export default Home;