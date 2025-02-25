import React, {
	Component
} from 'react';
import {
	Dimensions,
	StyleSheet
} from 'react-native';
import {
	TabView,
	TabBar
} from 'react-native-tab-view';

// import containers
import MyProfile from './containers/Tabs/MyProfile';
import Play from './containers/Tabs/Play';
import Withdraw from './containers/Tabs/Withdraw';

// import locales
import {
	translate
} from './locales';

class Tabs extends Component {
	constructor(props) {
		super(props);

		// init state
		this.state = {
			index: 1,
			routes: [{
					key: 'myprofile',
					title: translate('tab_myprofile')
				},
				{
					key: 'play',
					title: translate('tab_play')
				},
				{
					key: 'withdraw',
					title: translate('tab_withdraw')
				}
			]
		};
	}

	_renderTabBar = props => {
		return (
		  	<TabBar
				{...props}
				indicatorStyle={styles.indicatorStyle}
				labelStyle={styles.labelStyle}
				style={styles.tabBarStyle}
		  	/>
		);
	};

	_renderScene = ({ route }) => {
		switch (route.key) {
			case 'myprofile':
				return <MyProfile/>;
			case 'play':
				return <Play/>;
			case 'withdraw':
				return <Withdraw/>;
			default:
				return null;
		}
	}

	render() {
		return (
			<TabView
				style={styles.tabViewStyle}
				navigationState={this.state}
				renderScene={this._renderScene}
				renderTabBar={this._renderTabBar}
				onIndexChange={index => this.setState({ index })}
				initialLayout={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}
			/>
		);
	}
}

// component styles
const styles = StyleSheet.create({
	indicatorStyle: {
		backgroundColor: '#474747'
	},
	labelStyle: {
		color: '#474747',
		fontWeight: 'bold'
	},
	tabBarStyle: {
		backgroundColor: '#fff'
	},
	tabViewStyle: {
		flex: 1
	}
});

export default Tabs;