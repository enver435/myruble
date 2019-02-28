import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// import components
import Loading from '../../components/Loading';
import Balance from '../../components/Home/Balance';
import Enter from '../../components/Home/Enter';
import Calc from '../../components/Home/Calc';

class Home extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            user: props.userState
        };
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
            <View>
                {this.state.user.isAuth === true ? (
                    <View>
                        <ScrollView>
                            <Balance balance={this.state.user.data.balance}/>
                            <Calc heart={this.state.user.data.heart}/>
                            <Enter/>
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.screenCenter}>
                        <Text style={{ textAlign: 'center' }}>Пожалуйста, войдите, чтобы просмотреть эту страницу.</Text>
                    </View>
                )}
            </View>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    screenCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Home;