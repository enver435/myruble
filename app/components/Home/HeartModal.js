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
            btnGetHeartDisabled: true,
            btnShowAdDisabled: true
        };
    }

    componentDidMount() {
        // init admob rewarded
        this.initAdMob();

        // set timer
        this.setTimer();
    }

    async componentDidUpdate(prevProps, prevState) {
        // visible not equal
        if(this.props.visible != prevProps.visible) {
            // set timer
            this.setTimer();

            // init admob
            this.initAdMob();
        }
    }

    calcTime = async () => {
        const getOpenTime = parseInt(await getStorage('heartModalOpenTime'));
        return (getOpenTime + 60) - Math.round(new Date().getTime() / 1000);
    }

    setTimer = () => {
        // set timer
        this.timerInterval = setInterval(() => {
            this.calcTime().then((calcTime) => {
                if(calcTime >= 0) {
                    this.setState({ time: calcTime, btnGetHeartDisabled: true });
                } else {
                    if(this.state.btnGetHeartDisabled) {
                        this.setState({ btnGetHeartDisabled: false });
                    }
                    // clear timer
                    clearInterval(this.timerInterval);
                }
            });
        }, 1000);
    }

    fmtMSS = (s) => {
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }

    onClickGetHeart = async () => {
        // update heart +1
        this.props.updateHeart();

        // hide modal
        this.props.hideVisible();

        // open time modal remove from storage
        await removeStorage('heartModalOpenTime');

        // remove push notification
        await removeStorage('NotifyTask');

        // disable button
        this.setState({ btnGetHeartDisabled: true });
    }

    initAdMob = () => {
        // Init admob rewarded
        this.advert = firebase.admob().rewarded('ca-app-pub-4602055361552926/1723905120');
        const AdRequest = firebase.admob.AdRequest;
        const request = new AdRequest();

        // Load the advert with our AdRequest
        this.advert.loadAd(request.build());

        // onAdLoaded
        this.advert.on('onAdLoaded', () => {
            this.setState({ btnShowAdDisabled: false });
        });

        // onRewarded
        this.advert.on('onRewarded', async () => {
            // update heart +1
            this.props.updateHeart();

            // hide modal
            this.props.hideVisible();

            // open time modal remove from storage
            await removeStorage('heartModalOpenTime');
        });

        // onAdClosed
        // this.advert.on('onAdClosed', () => {
        //     this.props.hideVisible();
        // });
    }

    onClickShowAds = () => {
        if (this.advert.isLoaded()) {
            // show rewarded video
            this.advert.show();
        }
    }

    render() {
        return (
            <Overlay
                style={styles.container}
                onClose={this.props.hideVisible}
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
                                disabled={this.state.btnShowAdDisabled}
                            />
                        </View>
                        <View style={[styles.button, { paddingLeft: 10 }]}>
                            <Button
                                onPress={this.onClickGetHeart}
                                title={this.state.btnGetHeartDisabled ? this.fmtMSS(this.state.time) : 'Возьми'}
                                disabled={this.state.btnGetHeartDisabled}
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
    visible: PropTypes.bool
};

// component default props
HeartModal.defaultProps = {
    visible: false
};

export default HeartModal;