import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import {
    withNavigation
} from 'react-navigation';
import {
    Button
} from 'react-native-elements';

// import locales
import {
    translate
} from '../locales';

class Auth extends Component {
    constructor(props) {
        super(props);
    }

    onClickLogin = () => {
        this.props.navigation.navigate('SignIn');
    }

    render() {
        return <View style={styles.screenCenter}>
            <Text style={{ textAlign: 'center' }}>{translate('c_auth_text')}</Text>
            <Button
                onPress={this.onClickLogin}
                title={translate('c_auth_btn')}
            />
        </View>
    }
}

// component styles
const styles = StyleSheet.create({
    screenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default withNavigation(Auth);