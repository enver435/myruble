import React, {
    Component
} from 'react';
import firebase from 'react-native-firebase';

class AdMobBanner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const Banner = firebase.admob.Banner;
        const AdRequest = firebase.admob.AdRequest;
        const request = new AdRequest();

        return (
            <Banner
                unitId="ca-app-pub-5408014443454525/9643483437"
                size={"SMART_BANNER"}
                request={request.build()}
                onAdLoaded={() => {
                    console.log('Advert loaded');
                }}
            />
        );
    }
}

export default AdMobBanner;