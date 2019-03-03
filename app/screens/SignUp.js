import React, { Component } from 'react';
import {
    View, 
    TextInput, 
    ScrollView, 
    Dimensions, 
    StyleSheet
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Button } from 'react-native-material-ui';

class SignUp extends Component {
    static navigationOptions = {
        title: 'Регистрация'
    }

    constructor(props) {
        super(props);
        // init state
        this.state = {
            email: '',
            username: '',
            pass: '',
            loading: false
        };
        this.inputs = {};
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    onClickSignUp = () => {
        this.setState({ loading: true });

        const requestData = {
            email: this.state.email,
            username: this.state.username,
            pass: this.state.pass
        }
        this.props.userActions.signUp(requestData).then((response) => {
            if(response.status) {
                this.props.navigation.navigate('Home');
            } else {
                showMessage({
                    message: response.message,
                    type: response.status ? 'success' : 'danger'
                });
            }

            if(this._isMounted) {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
                    <View>
                        <View style={styles.signUpForm}>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="#474747"
                                keyboardType="email-address"
                                placeholder="E-mail"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onChangeText={(email) => this.setState({ email })}
                                onSubmitEditing={() => { this.inputs['username'].focus(); }}
                            />
                            <TextInput
                                ref={input => { this.inputs['username'] = input }}
                                style={styles.input}
                                underlineColorAndroid="#474747"
                                placeholder="Имя пользователя"
                                autoCapitalize="none"
                                returnKeyType="next"
                                onChangeText={(username) => this.setState({ username })}
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
                            <Button
                                onPress={this.onClickSignUp}
                                text={this.state.loading === true ? '...' : 'Регистрация'}
                                raised
                                style={{
                                    container: {
                                        backgroundColor: '#474747',
                                    },
                                    text: {
                                        color: '#fff'
                                    }
                                }}
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
    signUpForm: {
        marginBottom: 35
    }
});

export default SignUp;