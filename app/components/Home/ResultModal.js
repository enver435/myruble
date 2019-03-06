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

class ResultModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { taskSuccess, taskFail } = this.props.gameState.data;
        const { task, price } = this.props.gameState.defaultData;

        return (
            <Overlay
                style={styles.container}
                visible={this.props.visible}
                animationType="zoomIn"
                containerStyle={styles.containerStyle}
                childrenWrapperStyle={styles.childrenWrapperStyle}>
                    <Text style={styles.resultsText}>Результаты</Text>
                    <View style={styles.resultsBorderBottom}></View>
                    <View style={styles.block}>
                        <Text style={styles.blockTitle}>Правильные Ответы</Text>
                        <Text style={styles.taskSuccessCount}>{taskSuccess}</Text>
                    </View>
                    <View style={styles.block}>
                        <Text style={styles.blockTitle}>Неправильные Ответы</Text>
                        <Text style={styles.taskFailCount}>{taskFail}</Text>
                    </View>
                    <View style={styles.block}>
                        <Text style={styles.blockTitle}>Заработанные Деньги</Text>
                        <Text style={styles.earnPrice}>{taskSuccess == task ? price.toFixed(2) : 0}</Text>
                    </View>
                    <Button
                        onPress={this.props.hideVisible}
                        title="OK"
                    />
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
    },
    blockTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#474747'
    },
    taskSuccessCount: {
        color: '#00b894',
        fontSize: 16,
        fontWeight: 'bold'
    },
    taskFailCount: {
        color: '#d63031',
        fontSize: 16,
        fontWeight: 'bold'
    },
    earnPrice: {
        color: '#474747',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

// component prop types
ResultModal.propTypes = {
    gameState: PropTypes.object.isRequired,
    hideVisible: PropTypes.func.isRequired,
    visible: PropTypes.bool
};

// component default props
ResultModal.defaultProps = {
    visible: true
};

export default ResultModal;