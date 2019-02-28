import React from 'react';
import { Provider } from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import AppNavigator from './app/AppNavigator';

// import store
import store from './app/store';

const App = () => (
    <Provider store={store}>
        <AppNavigator/>
        <FlashMessage position="bottom"/>
    </Provider>
);

export default App;
