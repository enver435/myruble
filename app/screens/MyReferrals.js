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

// import locales
import {
    translate
} from '../locales';

class MyReferrals extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: translate('c_myref_title')
    }

    render() {
        return (
            <View style={styles.referralContainer}>
                <View>
                    <Text style={styles.referralText}>{translate('c_myref_title')}</Text>
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