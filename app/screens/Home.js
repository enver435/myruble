import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';

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

    componentDidMount() {
        // get user data
        const getUser = this.props.userActions.get();
        // get game default data
        const getGameDefault = this.props.gameActions.getDefault();
        // all operation async
        Promise.all([getUser, getGameDefault]).then((response) => {
            if(!response[0].status) {
                showMessage({
                    message: response[0].message,
                    type: 'danger'
                });
            }
            if(!response[1].status) {
                showMessage({
                    message: response[1].message,
                    type: 'danger'
                });
            }
            this.setState({ loading: false });
        });
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