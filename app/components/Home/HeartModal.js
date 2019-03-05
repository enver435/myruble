import React, {
    Component
} from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Overlay from 'react-native-modal-overlay';
import { Button } from 'react-native-elements';

class HeartModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Overlay
                style={styles.container}
                visible={this.props.visible}
                animationType="zoomIn"
                containerStyle={styles.containerStyle}
                childrenWrapperStyle={styles.childrenWrapperStyle}>
                    <Text style={styles.resultsText}>Результаты</Text>
                    <View style={styles.resultsBorderBottom}></View>
                    <View style={styles.buttons}>
                        <Button
                            onPress={this.props.hideVisible}
                            title="OK"
                            raised
                        />
                    </View>
            </Overlay>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    }, 
    containerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    childrenWrapperStyle: {
        backgroundColor: '#eee'
    },
    resultsText: {
        fontWeight:'300', 
        fontSize: 20
    },
    resultsBorderBottom: {
        borderBottomWidth: 1,
        width: 100,
        paddingTop: 10
    },
    block: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10,
    }
});

// component prop types
HeartModal.propTypes = {
    hideVisible: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
};

export default HeartModal;