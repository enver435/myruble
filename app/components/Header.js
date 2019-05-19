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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import locales
import {
    translate
} from '../locales';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLogoText}>myRuble</Text>
                </View>
                <View>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('PrizeReferral')} underlayColor="transparent">
                        <View style={styles.headerRight}>
                            <Icon name="bomb" size={20} color="#d10000" style={{ marginRight: 3 }} />
                            <Text style={styles.headerRightText}>{translate('c_header_prize')}</Text>
                        </View>
                    </TouchableHighlight>
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
        color: '#d10000'
    }
});

export default withNavigation(Header);