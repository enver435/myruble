import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

// import components
import Loading from '../../components/Loading';
import Balance from '../../components/Home/Balance';
import Enter from '../../components/Home/Enter';
import Calc from '../../components/Home/Calc';
import Control from '../../components/Home/Control';

class Home extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            user: props.userState,
            game: props.gameState
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.user != nextProps.userState) {
            this.setState({ user: nextProps.userState });
        } else if(this.state.game != nextProps.gameState) {
            this.setState({ game: nextProps.gameState });
        }
    }

    render() {
        return this.state.loading === true ? (
            <Loading/>
        ) : (
            this.state.user.isAuth === true ? (
                <View>
                    <ScrollView>
                        <Balance balance={this.state.user.data.balance}/>
                        <Calc
                            gameState={this.state.game}
                            heart={this.state.user.data.heart}/>
                        <Enter/>
                        <Control
                            gameActions={this.props.gameActions}
                            gameStatus={this.state.game.data.status}
                        />
                    </ScrollView>
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center' }}>Пожалуйста, войдите, чтобы просмотреть эту страницу.</Text>
                </View>
            )
        );
    }
}

export default Home;