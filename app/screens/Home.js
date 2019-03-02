import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

// import components
import Header from '../components/Header';
import Loading from '../components/Loading';

// import containers
import Tabs from '../Tabs';

class Home extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        // init state
        this.state = {
            loading: true,
            user: props.userState
        }

        // get user data
        const getUser = this.props.userActions.get();
        // get game default data
        const getGameDefault = this.props.gameActions.getDefault();
        // all operation async
        Promise.all([getUser, getGameDefault]).then(() => {
            this.setState({ loading: false });
        });
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.user != nextProps.userState) {
            this.setState({ user: nextProps.userState });
        }
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