import React, {
    Component
} from 'react';
import {
    View,
    Text
} from 'react-native';

class SelectMethod extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            loading: false,
            user: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let obj = {};
        if (prevState.user !== nextProps.userState) {
            obj.user = nextProps.userState;
        }
        return Object.keys(obj).length > 0 ? obj : null;
    }

    render() {
        return (
            <View>
                <Text> Withdraw SelectMethod Screen </Text>
            </View>
        );
    }
}

export default SelectMethod;