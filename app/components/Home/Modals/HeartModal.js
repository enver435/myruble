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
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from 'react-native-firebase';

// import helpers
import {
    GET,
    showToast,
    getStorage,
    removeStorage
} from '../../../Helpers';

// import api constants
import {
    API_URL
} from '../../../constants/api';

class HeartModal extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            currentTime: 0,
            time: 0,
            btnGetHeartDisabled: true,
            btnShowAdDisabled: true
        };
    }

    async componentDidMount() {
        // set mount
        this._isMounted = true;

        // fetch get current time
        await this._fetchCurrentTime();

        // set timer
        await this.setTimer();

        // init admob rewarded
        this.initAdMob();
    }

    componentWillUnmount() {
        // set mount
        this._isMounted = false;
    }

    async componentDidUpdate(prevProps, prevState) {
        // visible not equal
        if (this.props.visible != prevProps.visible) {
            // fetch get current time
            await this._fetchCurrentTime();

            // set timer
            await this.setTimer();

            // init admob rewarded
            this.initAdMob();
        }
    }

    _fetchCurrentTime = async () => {
        try {
            const response = await GET(API_URL);
            if(response.status) {
                if (this._isMounted) {
                    this.setState({
                        currentTime: response.data.appTime
                    });
                }
            }
        } catch (err) {
            showToast(err.message);
        }
    }

    calcEndTime = async () => {
        if(this._isMounted) {
            // set state current time
            this.setState({
                currentTime: this.state.currentTime + 1
            }, async () => {
                // set time
                this.setState({
                    time: this.modalTime - this.state.currentTime
                }, () => {
                    if(this.state.time <= 0) {
                        this.setState({
                            time: 0,
                            btnGetHeartDisabled: false
                        });
                        // clear timer
                        clearInterval(this.timerInterval);
                    }
                });
            });
        }
    }

    setTimer = async () => {
        // clear timer
        clearInterval(this.timerInterval);

        // get phone storage heart modal time
        this.modalTime = parseInt(await getStorage('heartModalTime'));

        // set timer
        this.timerInterval = setInterval(() => {
            this.calcEndTime();
        }, 1000);
    }

    fmtMSS = (s) => {
        return s < 0 || isNaN(s) ? this.fmtMSS(0) : (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }

    onClickGetHeart = async () => {
        // update heart +1
        this.props.updateHeart();

        // hide modal
        this.props.hideVisible();

        // open time modal remove from storage
        await removeStorage('heartModalTime');

        // disable button
        if (this._isMounted) {
            this.setState({
                btnGetHeartDisabled: true
            });
        }
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
            if (this._isMounted) {
                this.setState({
                    btnShowAdDisabled: false
                });
            }
        });

        // onRewarded
        this.advert.on('onRewarded', async () => {
            // update heart +1
            this.props.updateHeart();

            // hide modal
            this.props.hideVisible();

            // open time modal remove from storage
            await removeStorage('heartModalTime');
        });
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
                onBackdropPress={this.props.hideVisible}
                isVisible={this.props.visible}
                windowBackgroundColor="rgba(255, 255, 255, .5)"
                overlayBackgroundColor="#eee"
                width={Dimensions.get('window').width - 40}
                height="auto"
                children={
                    <View>
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
                    </View>
                }/>
        );
    }
}

// component styles
const styles = StyleSheet.create({
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
    updateHeart: PropTypes.func.isRequired,
    visible: PropTypes.bool
};

// component default props
HeartModal.defaultProps = {
    visible: false
};

export default HeartModal;