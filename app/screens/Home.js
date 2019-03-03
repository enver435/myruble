import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

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
            user: props.userState,
            game: props.gameState
        };
    }

    static navigationOptions = {
        header: null
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.user !== nextProps.userState) {
            return {
                user: nextProps.userState
            };
        }
        return null;
    }

    componentDidMount() {
        // get user data
        const getUser = this.props.userActions.get();
        // get game default data
        const getGameDefault = this.props.gameActions.getDefault();
        // all operation async
        Promise.all([getUser, getGameDefault]).then((response) => {
            if(response[0].status && response[1].status) {
                this.setState({ loading: false });
            } else {
                console.warn(response[0].message, response[1].message);
            }
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