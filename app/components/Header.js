import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from 'react-navigation';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    onClickLogin = () => {
        this.props.navigation.navigate('SignIn');
    }

    onClickLogout = () => {
        this.props.userActions.logoutUser();
    }

    render() {
        return (
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLogoText}>myRuble</Text>
                </View>
                <View>
                    {this.props.userState.isAuth ? (
                        <TouchableHighlight onPress={this.onClickLogout} underlayColor="transparent">
                            <View style={styles.headerRight}>
                                <Icon name="power-settings-new" size={20} color="#474747" style={{ marginRight: 3 }} />
                                <Text style={styles.headerRightText}>Выход</Text>
                            </View>
                        </TouchableHighlight>
                    ) : (
                        <TouchableHighlight onPress={this.onClickLogin} underlayColor="transparent">
                            <View style={styles.headerRight}>
                                <Icon name="account-circle" size={20} color="#474747" style={{ marginRight: 3 }} />
                                <Text style={styles.headerRightText}>Вход</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                </View>
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerLogoText: {
        color: '#474747',
        fontWeight: 'bold',
        fontSize: 20
    },
    headerRight: {
        flexDirection: 'row',
    },
    headerRightText: {
        color: '#545454'
    }
});

export default withNavigation(Header);