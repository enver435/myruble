import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

// import components
import ReferralList from '../components/ReferralList';

class MyReferrals extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: 'Мои рефералы'
    }

    render() {
        return (
            <View style={styles.referralContainer}>
                <View>
                    <Text style={styles.referralText}>Мои рефералы</Text>
                </View>
                <ReferralList/>
            </View>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    referralContainer: {
        flex: 1,
        paddingTop: 20,
        flexDirection: 'column',
        backgroundColor: '#fafafa'
    },
    referralText: {
        color: '#979797',
        fontSize: 12,
        textAlign: 'center'
    }
});

export default MyReferrals;