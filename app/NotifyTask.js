import firebase from 'react-native-firebase';
import { getStorage, setStorage } from './Helpers';

const NotifyTask = async () => {
    const getOpenTime = parseInt(await getStorage('heartModalOpenTime'));
    const diff        = (getOpenTime + 60) - Math.round(new Date().getTime() / 1000);

    if(diff <= 0 && !await getStorage('NotifyTask')) {
        const notification = new firebase.notifications.Notification()
            .setNotificationId('1')
            .setTitle('Возможность играть')
            .setBody('У вас есть 1 шанс начать игру прямо сейчас!')
            .setSound('default')
            .android.setChannelId('myruble_channel')
            .android.setSmallIcon('ic_launcher')
            .android.setPriority(firebase.notifications.Android.Priority.Max)
            .android.setVibrate([1000, 1000, 1000, 1000, 1000])
        
        firebase.notifications().displayNotification(notification);

        await setStorage('NotifyTask', 'true');
    }
}

export default NotifyTask;