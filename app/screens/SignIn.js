import React, { Component } from 'react';
import {
    View, 
    Text, 
    TextInput, 
    ScrollView, 
    Dimensions, 
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import { Button } from 'react-native-elements';

// import helpers
import { showToast } from '../Helpers';

class SignIn extends Component {
    static navigationOptions = {
        title: 'Вход'
    }
    
    constructor(props) {
        super(props);
        // init state
        this.state = {
            email: '',
            pass: '',
            loading: false
        };
        this.inputs = {};
    }

    componentDidMount() {
        // set mount
        this._isMounted = true;
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    onClickSignIn = () => {
        this.setState({ loading: true });

        const requestData = {
            email: this.state.email,
            pass: this.state.pass
        }
        this.props.userActions.signIn(requestData).then((response) => {
            if(response.status) {
                this.props.navigation.navigate('Home');
            } else {
                showToast(response.message);
            }

            if(this._isMounted) {
                this.setState({ loading: false });
            }
        });
    }

    onClickSignUp = () => {
        this.props.navigation.navigate('SignUp');
    }
    
    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
                    <View>
                        <View style={styles.signInForm}>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="#474747"
                                keyboardType="email-address"
                                returnKeyType="next"
                                placeholder="E-mail"
                                autoCapitalize="none"
                                onChangeText={(email) => this.setState({ email })}
                                onSubmitEditing={() => { this.inputs['pass'].focus(); }}
                            />
                            <TextInput
                                ref={input => { this.inputs['pass'] = input }}
                                style={styles.input}
                                underlineColorAndroid="#474747"
                                placeholder="Пароль"
                                autoCapitalize="none"
                                secureTextEntry={true}
                                onChangeText={(pass) => this.setState({ pass })}
                            />
                            <TouchableHighlight onPress={this.onClickForgot} underlayColor="transparent">
                                <Text style={styles.forgotText}>Забыли пароль?</Text>
                            </TouchableHighlight>
                            <Button
                                onPress={this.onClickSignIn}
                                title="Вход"
                                loading={this.state.loading}
                                raised
                            />
                        </View>
                        <View>
                            <Text style={styles.signUpText}>У вас нет учетной записи?</Text>
                            <Button
                                onPress={this.onClickSignUp}
                                title="Регистрация"
                                raised
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    scrollView: {
        height: Dimensions.get('window').height,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 25,
        paddingRight: 25
    },
    input: {
        fontSize: 15,
        marginBottom: 10,
    },
    forgotText: {
        fontSize: 13,
        color: '#979797',
        textAlign: 'right',
        marginBottom: 10,
    },
    signInForm: {
        marginBottom: 35
    },
    signUpText: {
        marginBottom: 10,
        textAlign: 'center'
    }
});

export default SignIn;