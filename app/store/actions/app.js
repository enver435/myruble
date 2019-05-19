// import action type constants
import {
    SET_LOCALE
} from '../../constants/actions/app';

export const setLocale = (locale) => dispatch => {
    dispatch({
        type: SET_LOCALE,
        payload: locale
    });
}