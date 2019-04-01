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
import Referal from './containers/Tabs/Referal';
import Play from './containers/Tabs/Play';
import Withdraw from './containers/Tabs/Withdraw';

class Tabs extends Component {
	constructor(props) {
		super(props);

		// init state
		this.state = {
			index: 1,
			routes: [{
					key: 'referal',
					title: 'Реферал'
				},
				{
					key: 'play',
					title: 'Играть'
				},
				{
					key: 'withdraw',
					title: 'Выплаты'
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
			case 'referal':
				return <Referal/>;
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