import React, {
    Component
} from 'react';
import {
    View,
    TextInput,
    ScrollView,
    Dimensions,
    StyleSheet
} from 'react-native';
import {
    Button,
    CheckBox
} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';

// import helpers
import {
    getFirebaseToken,
    showToast
} from '../Helpers';

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
            ref_code: '',
            loading: false,
            checked: false,
            disabled: true
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

    onClickSignUp = async () => {
        // set state
        this.setState({
            loading: true,
            disabled: true
        });

        // create request object data
        const reqData = {
            email: this.state.email.toLowerCase(),
            username: this.state.username.toLowerCase(),
            pass: this.state.pass,
            ref_code: this.state.ref_code,
            firebase_token: await getFirebaseToken(),
            mac_address: await DeviceInfo.getMACAddress(),
            timezone: await DeviceInfo.getTimezone(),
            device_id: await DeviceInfo.getUniqueID()
        };

        // status variables
        let navigateStatus = false;

        // request sign up
        const response = await this.props.userActions.signUp(reqData);
        if (response.status) {
            // set navigate status
            navigateStatus = true;
            // navigate main screen
            this.props.navigation.navigate('Main');
        } else {
            showToast(response.message);
        }

        // set state
        if (this._isMounted && !navigateStatus) {
            this.setState({
                loading: false,
                disabled: false
            });
        }
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
                                returnKeyType="next"
                                secureTextEntry={true}
                                onChangeText={(pass) => this.setState({ pass })}
                                onSubmitEditing={() => { this.inputs['ref_code'].focus(); }}
                            />
                            <TextInput
                                ref={input => { this.inputs['ref_code'] = input }}
                                style={styles.input}
                                underlineColorAndroid="#474747"
                                placeholder="Реферальный код (необязательный)"
                                autoCapitalize="none"
                                onChangeText={(ref_code) => this.setState({ ref_code })}
                            />
                            <CheckBox
                                title='Продолжая вы принимаете Условия Обслуживания и Политика Конфиденциальности'
                                checked={this.state.checked}
                                onPress={() => this.setState({ checked: !this.state.checked, disabled: !this.state.disabled })}
                            />
                            <Button
                                onPress={this.onClickSignUp}
                                title="Регистрация"
                                loading={this.state.loading}
                                disabled={!this.state.disabled ? this.state.loading : this.state.disabled}
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