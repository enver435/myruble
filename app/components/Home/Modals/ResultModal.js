import React, {
    Component
} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import {
    Button,
    Overlay
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import locales
import {
    translate
} from '../../../locales';

class ResultModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    _onCloseModal = async () => {
        this.setState({
            loading: true
        }, async () => {
            await this.props.hideVisible();
            this.setState({
                loading: false
            });
        });
    }

    render() {
        const {
            taskSuccess,
            taskFail
        } = this.props.gameState.data;
        const {
            task,
            earn,
            earn_xp
        } = this.props.gameState.defaultData;
        
        return (
            <Overlay
                onBackdropPress={this._onCloseModal}
                isVisible={this.props.visible}
                windowBackgroundColor="rgba(255, 255, 255, .5)"
                overlayBackgroundColor="#eee"
                width={Dimensions.get('window').width - 40}
                height="auto"
                children={
                    <View style={styles.container}>
                        <Text style={styles.resultsText}>{translate('result_modal_title')}</Text>
                        <View style={styles.resultsBorderBottom}></View>
                        <View style={styles.block}>
                            <Text style={styles.blockTitle}>{translate('result_modal_success')}</Text>
                            <Text style={styles.taskSuccessCount}>{taskSuccess}</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.blockTitle}>{translate('result_modal_unsuccess')}</Text>
                            <Text style={styles.taskFailCount}>{taskFail}</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.blockTitle}>{translate('result_modal_xp')}</Text>
                            <Text style={styles.earnPrice}>{taskSuccess == task ? earn_xp : 0}</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.blockTitle}>{translate('result_modal_earn')}</Text>
                            <Text style={styles.earnPrice}>{taskSuccess == task ? earn : 0} <Icon size={15} name="currency-rub" color="#474747"/></Text>
                        </View>
                        <Button
                            onPress={this._onCloseModal}
                            title="OK"
                            loading={this.state.loading}
                            disabled={this.state.loading}
                            containerStyle={{ marginTop: 20, width: '50%' }}
                        />
                    </View>
                }/>
        );
    }
}

// component styles
const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        alignItems: 'center'
    },
    resultsText: {
        fontWeight: '300',
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
    visible: false
};

export default ResultModal;