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
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from 'react-native-firebase';

// import helpers
import { getStorage, removeStorage } from '../../Helpers';

class HeartModal extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            time: 0,
            btnDisabled: true
        };
    }

    componentDidMount() {
        this.getOpenTime();
        this.setTime();
        this.initAds();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.time == 0) {
            clearInterval(this.timerInterval);

            if(this.state.btnDisabled != false) {
                this.setState({ btnDisabled: false });
            }
        }
    }

    getOpenTime = async () => {
        this.getOpenTime = parseInt(await getStorage('heartModalOpenTime'));
    }

    setTime = () => {
        this.timerInterval = setInterval(() => {
            const time = (this.getOpenTime + 6) - Math.round(new Date().getTime() / 1000);
            this.setState({ time });
        }, 1000);
    }

    fmtMSS = (s) => {
        return (s - (s %= 60)) / 60 + ( 9 < s ? ':' : ':0') + s;
    }

    onClickGetHeart = async () => {
        this.props.updateHeart();
        this.props.hideVisible();
        await removeStorage('heartModalOpenTime');
    }

    initAds = () => {
        this.advert = firebase.admob().rewarded('ca-app-pub-4602055361552926/1723905120');

        const AdRequest = firebase.admob.AdRequest;
        const request = new AdRequest();
        request.addKeyword('foo').addKeyword('bar');

        // Load the advert with our AdRequest
        this.advert.loadAd(request.build());

        this.advert.on('onAdLoaded', () => {
            console.warn('Advert ready to show.');
        });

        this.advert.on('onRewarded', (event) => {
            console.warn('The user watched the entire video and will now be rewarded!', event);
        });
    }

    onClickShowAds = () => {
        if (this.advert.isLoaded()) {
            this.advert.show();
        } else {
        }
    }

    render() {
        return (
            <Overlay
                style={styles.container}
                visible={this.props.visible}
                animationType="zoomIn"
                containerStyle={styles.containerStyle}
                childrenWrapperStyle={styles.childrenWrapperStyle}>
                    <View style={styles.block}>
                        <Text>Чтобы начать игру, посмотрите рекламу или подождите</Text>
                    </View>
                    <View style={[styles.block, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Icon name="favorite-border" size={45} color="#474747"/>
                        <Text style={styles.heartText}>+1</Text>
                    </View>
                    <View style={styles.block}>
                        <View style={[styles.button, { paddingRight: 10 }]}>
                            <Button
                                onPress={this.onClickShowAds}
                                title="Смотреть"
                                titleStyle={{ color: '#fbbc05' }}
                            />
                        </View>
                        <View style={[styles.button, { paddingLeft: 10 }]}>
                            <Button
                                onPress={this.onClickGetHeart}
                                title={this.state.btnDisabled ? this.fmtMSS(this.state.time) : 'Возьми'}
                                disabled={this.state.btnDisabled}
                            />
                        </View>
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
    block: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10
    },
    button: {
        flex: 1
    },
    heartText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#474747'
    }
});

// component prop types
HeartModal.propTypes = {
    hideVisible: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
};

// component default props
HeartModal.defaultProps = {
    visible: true
};

export default HeartModal;