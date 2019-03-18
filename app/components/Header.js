import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from 'react-navigation';

class Header extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            user: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let obj = {};
        if (prevState.user !== nextProps.userState) {
            obj.user = nextProps.userState;
        }
        return Object.keys(obj).length > 0 ? obj : null;
    }

    onClickLogin = () => {
        this.props.navigation.navigate('SignIn');
    }

    onClickLogout = () => {
        this.props.userActions.logout();
    }

    render() {
        return (
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLogoText}>myRuble</Text>
                </View>
                <View>
                    {this.state.user.isAuth ? (
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

// component prop types
Header.propTypes = {
    userState: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired
};

export default withNavigation(Header);