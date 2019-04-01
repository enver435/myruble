import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

// import helpers
import {
    showToast,
    getStorage,
    getFirebaseToken
} from '../Helpers';

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
                    // if new firebase token
                    if (userData && userData.firebase_token != firebaseToken) {
                        await this.props.userActions.update({
                            firebase_token: firebaseToken
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
                    const gameResponse = await this.props.gameActions.getLevels();
                    if (gameResponse.status) {
                        await this.props.gameActions.getLevelData(userRes.data.level_xp);
                    } else {
                        // show error message
                        showToast(gameResponse.message);
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
                <Header 
                    userState={this.props.userState} 
                    userActions={this.props.userActions}/>
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