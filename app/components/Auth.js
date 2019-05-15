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
import Icon from 'react-native-vector-icons/MaterialIcons';

class Auth extends Component {
    constructor(props) {
        super(props);
    }

    onClickLogin = () => {
        this.props.navigation.navigate('SignIn');
    }

    render() {
        return <View style={styles.screenCenter}>
            <Text style={{ textAlign: 'center' }}>Пожалуйста, войдите, чтобы просмотреть эту страницу.</Text>
            <Button
                onPress={this.onClickLogin}
                title="Вход"
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