import React, {
    Component
} from 'react';
import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class SplashScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ marginBottom: 15, width: 145, height: 145, alignItems: 'center', justifyContent: 'center', backgroundColor: '#353535', borderRadius: 100, borderColor: '#555', borderWidth: 4 }}>
                        <Icon size={65} name="currency-rub" color="#fff"/>
                    </View>
                    <Text style={styles.textStyles}>myRuble</Text>
                </View>
                <View style={{ flex: 0.2 }}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#474747'
    },
    textStyles: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    }
}

export default SplashScreen;