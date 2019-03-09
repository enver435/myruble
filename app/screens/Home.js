import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

// import helpers
import { showToast, getStorage, getFirebaseToken } from '../Helpers';

// import components
import Header from '../components/Header';
import Loading from '../components/Loading';

// import containers
import Tabs from '../Tabs';

class Home extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: true,
            user: {},
            game: {}
        };
    }

    static navigationOptions = {
        header: null
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let obj = {};
        if (prevState.user !== nextProps.userState) {
            obj.user = nextProps.userState;
        }
        if (prevState.game !== nextProps.gameState) {
            obj.game = nextProps.gameState;
        }
        return Object.keys(obj).length > 0 ? obj : null;
    }

    async componentDidMount() {
        // set mount
        this._isMounted = true;

        // get user data
        const getUser = this.props.userActions.get();
        
        // get game default data
        const getGameDefault = this.props.gameActions.getDefault();

        // all operation async
        Promise.all([getUser, getGameDefault]).then(async (response) => {
            
            /**
             * Get User
             */
            if(!response[0].status) {
                // show error message
                showToast(response[0].message);
            } else {
                const userData      = await getStorage('userData');
                const firebaseToken = await getFirebaseToken();
                if(userData && userData.firebase_token != firebaseToken) {
                    await this.props.userActions.update({
                        firebase_token: firebaseToken
                    });
                }
            }

            /**
             * Get Default Game Information
             */
            if(!response[1].status) {
                // show error message
                showToast(response[1].message);
            }

            // hide loading
            if(this._isMounted) {
                this.setState({ loading: false });
            }
        });
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    render() {
        return this.state.loading === true ? (
            <Loading/>
        ) : (
            <View style={styles.container}>
                <Header 
                    userState={this.state.user} 
                    userActions={this.props.userActions}/>
                <Tabs/>
            </View>
        );
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