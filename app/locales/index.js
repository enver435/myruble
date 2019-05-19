import {
    getStorage,
    setStorage
} from '../Helpers';
import store from '../store';
import en from './en';
import ru from './ru';
import tr from './tr';

export const setLocale = async (locale) => {
    await setStorage('locale', locale);
    return locale;
}

export const getLocale = async () => {
    return await getStorage('locale');
}

export const translate = (key, replace = {}) => {
    const currentLocale = store.getState().app.locale;
    let keys = {
        en,
        ru,
        tr
    };

    if(keys[currentLocale][key]) {
        let string = keys[currentLocale][key];
        if(Object.keys(replace).length > 0) {
            for (const [key, val] of Object.entries(replace)) {
                string = string.replace(new RegExp(`{${key}}`, 'g'), val);
            }
        }
        return string;
    }
    return '';
}