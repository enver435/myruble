import React, {
    Component
} from 'react';
import {
    View,
    TextInput,
    TouchableHighlight,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

class Enter extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            input: ''
        };
    }

    onClickSend = () => {
        if (this.state.input.length > 0) {
            // send answer
            this.props.sendAnswer(this.state.input);
            // clear input
            this.setState({
                input: ''
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid="#474747"
                    keyboardType="numeric"
                    returnKeyType="next"
                    value={this.state.input}
                    onChangeText={(val) => this.setState({ input: val })}
                    onSubmitEditing={() => { 
                        this.onClickSend();
                    }}
                    blurOnSubmit={false}
                />
            </View>
        )
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        padding: 35,
        flexDirection: 'row'
    },
    textInput: {
        fontSize: 17,
        flex: 1
    },
    btnSend: {
        marginTop: 7
    }
});

// component prop types
Enter.propTypes = {
    sendAnswer: PropTypes.func.isRequired
};

export default Enter;