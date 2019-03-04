import {
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const checkUpdatedApp = async () => {
    try {
        const appVersion = await AsyncStorage.getItem('appVersion');
        if (appVersion != DeviceInfo.getVersion()) {
            return true;
        }
        return false;
    } catch (err) {
        console.warn(err.message);
    }
}

export const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        50,
    );
}