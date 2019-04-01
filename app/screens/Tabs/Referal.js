import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

class Referal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.screenCenter}>
                <Text style={{ textAlign: 'center' }}>Coming Soon!</Text>
            </View>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    screenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Referal;